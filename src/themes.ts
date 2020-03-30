import fetch from "node-fetch";
import { KintoResponse, Reference } from ".";
import { sortByKey } from "./sort";
import { getVariants } from "./variants";

type ThemeRaw = {
  id: string;
  title: string;
  variants: string;
  position: number;
  refs: Reference[];
  parent?: string | null;
  icon?: string;
};

export type Theme = {
  title: string;
  variants: string[];
  icon?: string;
  position: number;
  breadcrumbs: SubTheme[];
  children: SubTheme[];
  refs: Reference[];
};

type SubTheme = {
  label: string;
  position: number;
};

type ThemeMap = { [key: string]: ThemeRaw };

function getParents(theme: ThemeRaw, themesById: ThemeMap): SubTheme[] {
  let parentId = theme.parent;
  const parts: SubTheme[] = [];
  while (parentId) {
    const node = themesById[parentId];
    parts.unshift({ label: node.title, position: node.position });
    parentId = node && node.parent;
  }
  return parts;
}

function getChildren(theme: ThemeRaw, themes: ThemeRaw[]): SubTheme[] {
  return themes
    .filter(node => node.parent === theme.id)
    .sort(sortByKey("position"))
    .map(({ title, position }) => ({ label: title, position }));
}

export function processThemes(items: ThemeRaw[]): Theme[] {
  const itemMap: ThemeMap = items.reduce((items, item) => {
    items[item.id] = item;
    return items;
  }, {});

  return items.map(theme => {
    const breadcrumbs = getParents(theme, itemMap);
    const children = getChildren(theme, items);
    return {
      breadcrumbs,
      children,
      icon: theme.icon,
      position: theme.position,
      refs: theme.refs.map(({ title, url }) => ({ title, url })),
      title: theme.title,
      variants: getVariants(theme)
    };
  });
}

export async function getThemes(baseUrl: string): Promise<Theme[]> {
  const response = await fetch(
    `${baseUrl}/kinto/v1/buckets/datasets/collections/themes/records?_sort=title`
  );
  const items: KintoResponse<ThemeRaw[]> = await response.json();
  return processThemes(items.data);
}

if (require.main === module) {
  getThemes(`${process.env.DATAFILLER_URL}`)
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
      console.error(`${data.length} themes`);
    })
    .catch(error => console.error(error));
}
