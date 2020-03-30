import fetch from "node-fetch";
import { KintoResponse } from ".";

type AgreementsItemRaw = {
  cid: string;
  groups?: ArticleGroup[];
};

export type AgreementsItem = {
  cid: string;
  groups: ArticleGroup[];
};

type ArticleGroup = {
  id: string;
  selection: string[];
};

export function processAgreements(
  items: AgreementsItemRaw[]
): AgreementsItem[] {
  return items
    .map(({ cid, groups }) => ({
      cid,
      groups: (groups || []).filter(group => group.selection.length > 0)
    }))
    .filter(item => item.groups.length > 0);
}

export async function getAgreementArticles(
  baseUrl: string
): Promise<AgreementsItem[]> {
  const response = await fetch(
    `${baseUrl}/kinto/v1/buckets/datasets/collections/ccns/records?_sort=cid`
  );
  const items: KintoResponse<AgreementsItemRaw[]> = await response.json();
  return processAgreements(items.data);
}

if (require.main === module) {
  getAgreementArticles(`${process.env.DATAFILLER_URL}`)
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
      console.error(`${data.length} ccn`);
    })
    .catch(error => console.error(error));
}
