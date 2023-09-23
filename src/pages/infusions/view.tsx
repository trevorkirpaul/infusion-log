import { GetServerSideProps } from "next";
import { supabase } from "@/utils/supabase";
import type { Infusion } from "@/utils/types";
import InfusionTable from "@/components/InfusionTable";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import {
  Affix,
  Button,
  Transition,
  rem,
  Pagination,
  Select,
  Group,
  Title,
  MediaQuery,
} from "@mantine/core";
import { useRouter } from "next/router";
import { getUniqueBleedLocations } from "@/utils/getUniqueBleedLocations";
import { NotSignedInCard } from "@/components/NotSignedInCard";
import { ParsedUrlQuery } from "querystring";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { Breadcrumbs } from "@/components/BreadCrumbs";

const createPageHref = (page: number) => `?page=${page}`;

const getParamFor = (
  q: "bleed_location" | "count" | "page",
  parsedURLQuery: ParsedUrlQuery
) => {
  const foundQuery = parsedURLQuery[q];
  if (!foundQuery) return "";
  switch (q) {
    case "bleed_location":
      return `&bleed_location=${foundQuery}`;
    case "page":
      return `&page=${foundQuery}`;
    case "count":
      return `&count=${foundQuery}`;
    default:
      return "";
  }
};

interface IProps {
  infusions: Infusion[];
  numberOfInfusions: number;
  uniqueBleedLocations: string[];
  userID: string | null;
}

export default function ViewInfusions({
  infusions,
  numberOfInfusions,
  uniqueBleedLocations,
  userID,
}: IProps) {
  const [scroll, scrollTo] = useWindowScroll();
  const router = useRouter();
  const { page: currentPage } = router.query;
  if (!userID) {
    return (
      <>
        <NotSignedInCard />
      </>
    );
  }
  return (
    <>
      <Affix position={{ bottom: rem(100), right: rem(20) }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => {
            return (
              <Button
                variant="filled"
                style={{ backgroundColor: "dodgerblue", ...transitionStyles }}
                // color="grape"
                leftIcon={<IconArrowUp size="1rem" />}
                onClick={() => scrollTo({ y: 0 })}
              >
                Scroll to top
              </Button>
            );
          }}
        </Transition>
      </Affix>
      <Breadcrumbs
        crumbs={[
          { title: "Home", href: "/" },
          { title: "Infusions", href: "/infusions/view" },
        ]}
      />
      <Title className="mb-4">View Infusions ({numberOfInfusions})</Title>
      <Select
        className="mb-4"
        onChange={(selection) => {
          const computedBleedLocation = selection
            ? selection.replace(" ", "%20")
            : null;
          const computedBleedLocationParam = computedBleedLocation
            ? `&bleed_location=${computedBleedLocation}`
            : "";
          router.push(
            `${createPageHref(1)}${getParamFor(
              "count",
              router.query
            )}${computedBleedLocationParam}`
          );
        }}
        clearable
        label="Filter by bleed location:"
        placeholder="Pick one"
        data={uniqueBleedLocations.map((bleedLocation) => ({
          value: bleedLocation,
          label: bleedLocation,
        }))}
      />
      <Select
        className="mb-8"
        label="Items Per Page:"
        placeholder="Pick one"
        defaultValue={
          typeof router.query.count === "string" ? router.query.count : "5"
        }
        data={[
          { value: "5", label: "5" },
          { value: "10", label: "10" },
          { value: "25", label: "25" },
        ]}
        onChange={(selection) => {
          router.push(
            `?${getParamFor("page", router.query)}${getParamFor(
              "bleed_location",
              router.query
            )}&count=${selection}`
          );
        }}
      />
      <Group align="center" position="apart" className="mb-4">
        <Pagination
          value={currentPage ? Number(currentPage) : 1}
          onChange={(page) => {
            router.push(
              `${createPageHref(page)}${getParamFor(
                "bleed_location",
                router.query
              )}${getParamFor("count", router.query)}`
            );
          }}
          total={Math.ceil(
            numberOfInfusions /
              (router.query.count ? Number(router.query.count) - 1 : 4)
          )}
        />
      </Group>
      <InfusionTable infusions={infusions} />
      <Pagination
        className="mt-4 mb-10"
        value={currentPage ? Number(currentPage) : 1}
        onChange={(page) => {
          router.push(
            `${createPageHref(page)}${getParamFor(
              "bleed_location",
              router.query
            )}${getParamFor("count", router.query)}`
          );
        }}
        total={Math.ceil(
          numberOfInfusions /
            (router.query.count ? Number(router.query.count) - 1 : 4)
        )}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;
  const { page, bleed_location = null, count } = ctx.query;
  const range = getRange(page, Number(count || 5));

  const { count: numberOfInfusions, data } = await supabase
    .from("infusion")
    .select("*", { count: "exact", head: false })
    .eq("user_id", userID)
    .eq(bleed_location ? "bleed_location" : "", bleed_location)
    .order("infusion_date", { ascending: false })
    .range(range.start, range.end);

  const { data: allBleedLocations, error: allBleedLocationsError } =
    await supabase
      .from("infusion")
      .select("bleed_location")
      .eq("user_id", userID);

  const uniqueBleedLocations = getUniqueBleedLocations({
    allBleedLocations,
    errorFromSB: allBleedLocationsError,
  });

  return {
    props: {
      numberOfInfusions,
      uniqueBleedLocations,
      infusions: data || [],
      userID: userID || null,
    },
  };
};

const getRange = (page: string | string[] | undefined, count: number = 0) => {
  const safePage = page ? Number(page) - 1 : 0;

  if (safePage < 0) return { start: 0, end: 4 };

  const start = safePage * count;
  const end = start + count - 1;

  return { start, end };
};
