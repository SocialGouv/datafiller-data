import fetch from "node-fetch";
import { KintoResponse, Reference } from ".";
import { sortRowRefsByPosition } from "./sort";

export type HighlightsItem = {
  title: string;
  refs: Reference[];
};

export async function getHightlights(
  baseUrl: string
): Promise<HighlightsItem[]> {
  const response = await fetch(
    `${baseUrl}/kinto/v1/buckets/datasets/collections/highlights/records`
  );
  const items: KintoResponse<HighlightsItem[]> = await response.json();
  return items.data.map(sortRowRefsByPosition);
}

if (require.main === module) {
  getHightlights(`${process.env.DATAFILLER_URL}`)
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
      console.error(`${data.length} highlights extraits`);
    })
    .catch(error => console.error(error));
}
