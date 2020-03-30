import fetch from "node-fetch";
import { KintoResponse } from ".";

type ExternalDocRaw = {
  title: string;
  urls: string;
};
export type ExternalDoc = {
  title: string;
  urls: string[];
};

export function processExternalDocs(items: ExternalDocRaw[]): ExternalDoc[] {
  return items
    .map(({ title, urls }) => ({
      title,
      urls: urls
        .split("\n")
        .map(url => url.trim())
        .filter(Boolean)
    }))
    .filter(({ urls }) => urls.length > 0);
}

export async function getExternalDocUrl(
  baseUrl: string
): Promise<ExternalDoc[]> {
  const response = await fetch(
    `${baseUrl}/kinto/v1/buckets/datasets/collections/fiches/records?_sort=-last_modified&_limit=1000`
  );
  const items: KintoResponse<ExternalDocRaw[]> = await response.json();
  return processExternalDocs(items.data);
}

if (require.main === module) {
  getExternalDocUrl(`${process.env.DATAFILLER_URL}`)
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
      console.error(`${data.length} highlights extraits`);
    })
    .catch(error => console.error(error));
}
