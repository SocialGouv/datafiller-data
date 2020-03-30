import fetch from "node-fetch";
import { KintoResponse, Reference } from ".";
import { hasRef, sortRefs } from "./sort";
import { getVariants } from "./variants";
import { decodeHTML } from "./decodeHtml";

type SavedRequestsRaw = {
  title: string;
  variants?: string;
  refs: Reference[];
};

export type SavedRequest = {
  title: string;
  variants: string[];
  refs: Reference[];
};

const sortByPosition = sortRefs((row: Reference) => row.position || 0);

// fetch title from remote url
async function getPageTitle(url: string): Promise<string> {
  try {
    const text = await fetch(url).then(r => r.text());
    const matches = text.match(/<title>([^<]+)<\/title>/i);
    if (matches) {
      return decodeHTML(matches[1]);
    }
  } catch (e) {
    console.error(`fail to retrieve title on ${url}`);
    console.error(e);
  }
  return url;
}

function getTitle(item: Reference): Promise<string> {
  if (item.title) {
    return Promise.resolve(item.title);
  }
  if (item.url && item.url.match(/^https?:\/\//)) {
    return getPageTitle(item.url);
  }
  return Promise.resolve(item.url);
}

async function fixRefsTitles(ref: Reference): Promise<Reference> {
  return {
    url: ref.url,
    title: await getTitle(ref),
    position: ref.position
  };
}

export async function processRequests(
  items: SavedRequestsRaw[]
): Promise<SavedRequest[]> {
  const rows = items.filter(hasRef).map(async item => {
    return {
      title: item.title,
      variants: getVariants(item),
      refs: await Promise.all(item.refs.sort(sortByPosition).map(fixRefsTitles))
    };
  });
  return Promise.all(rows);
}

export async function getSavedRequests(
  baseUrl: string
): Promise<SavedRequest[]> {
  const response = await fetch(
    `${baseUrl}/kinto/v1/buckets/datasets/collections/requetes/records?_sort=title`
  );
  const items: KintoResponse<SavedRequestsRaw[]> = await response.json();
  return processRequests(items.data);
}

if (require.main === module) {
  getSavedRequests(`${process.env.DATAFILLER_URL}`)
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
      console.error(`${data.length} highlights extraits`);
    })
    .catch(error => console.error(error));
}
