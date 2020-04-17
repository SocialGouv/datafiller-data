import {
  SOURCES,
  cdtnSources,
  cdtnRoutes,
  getSourceByRoute,
  sourceByRoute
} from "./sources";

const sourcesPriority = [
  SOURCES.SHEET_SP,
  SOURCES.SHEET_MT,
  SOURCES.EXTERNALS,
  SOURCES.CDT
];

const getSource = (url: string): cdtnSources => {
  const [, slug] = url.match(/^\/([^/]+)\//);
  if (Object.prototype.hasOwnProperty.call(sourceByRoute, slug)) {
    return getSourceByRoute(slug as cdtnRoutes);
  }
  return SOURCES.EXTERNALS;
};

export const sortByKey = <T, K extends keyof T>(key: K) => (
  a: T,
  b: T
): number =>
  typeof a[key] === "number"
    ? Number(a[key]) - Number(b[key])
    : `${a[key]}`.localeCompare(`${b[key]}`);

// sort datafiller references by key and source
export const sortRefs = cb => (a: UrlRef, b: UrlRef): number => {
  if (cb(a) === cb(b)) { 
    return (
      sourcesPriority.indexOf(getSource(a.url)) -
      sourcesPriority.indexOf(getSource(b.url))
    );
  }
  return cb(a) - cb(b);
};

export const hasUrl = <T extends UrlRef>(row: T): boolean => !!row.url;

export const hasRef = <T extends Row>(row: T): boolean =>
  row.refs && row.refs.length > 0;

// filter and sort row refs
export const sortRowRefs = cb => <T extends Row>(row: T): T => ({
  ...row,
  refs: (row.refs && row.refs.filter(hasUrl).sort(sortRefs(cb))) || []
});

export const sortRowRefsByPosition = sortRowRefs(node => node.position);
export const sortRowRefsByRelevance = sortRowRefs(node => -node.relevance);

type UrlRef = {
  url: string;
};

type Row = {
  refs: UrlRef[];
};
