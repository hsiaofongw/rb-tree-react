import { create, EnterElement, select } from "d3";
import { asNonNullable } from "../../utils/typeUtils";
import { Selection } from "d3";

export type UnionFinder = {
  indexToParentIndexMap: number[];
};

const takeFirst = <T>(s: Set<T>): T | undefined => {
  for (const [v] of s.entries()) {
    const element = v;
    s.delete(v);
    return element;
  }
};

type It<T> = T extends Array<infer EleT>
  ? EleT
  : T extends Set<infer ItemT>
  ? ItemT
  : never;

type A = It<string[]>;
type B = It<Set<number>>;
type C = It<number>;

type Tree = {
  site: number;
  children: Tree[];
};

type EdgesMap = Map<number, Set<number>>;

type ConnectsGraph = {
  toParentEdges: EdgesMap;
  toChildrenEdges: EdgesMap;
  rootSet: Set<number>;
  instance: UnionFinder;
};

const addEdge = (edgesMap: EdgesMap, from: number, to: number): void => {
  if (!edgesMap.get(from)) {
    edgesMap.set(from, new Set<number>());
  }
  edgesMap.get(from)!.add(to);
};

const createGraph = (instance: UnionFinder): ConnectsGraph => {
  const untraversedSites = new Set<number>();
  const totalSites = instance.indexToParentIndexMap.length;
  for (let siteIdx = 0; siteIdx < totalSites; ++siteIdx) {
    untraversedSites.add(siteIdx);
  }

  // 节点到其父节点到连结
  const toParentEdges = new Map<number, Set<number>>();

  // 节点到其子节点的连结
  const toChildrenEdges = new Map<number, Set<number>>();

  // 根集是这些父节点指向它自身的节点
  const rootSet = new Set<number>();

  // 构造图、根集
  while (untraversedSites.size > 0) {
    let site: number = asNonNullable(takeFirst(untraversedSites));
    while (true) {
      const parentSite = instance.indexToParentIndexMap[site];
      addEdge(toParentEdges, site, parentSite);
      addEdge(toChildrenEdges, parentSite, site);
      if (parentSite === site) {
        rootSet.add(site);
        break;
      }
      site = parentSite;
    }
  }

  return { toParentEdges, toChildrenEdges, instance, rootSet };
};

const createTree = (toChildrenEdges: EdgesMap, rootSite: number): Tree => {
  const tree: Tree = {
    site: rootSite,
    children: [],
  };

  const childSites = toChildrenEdges.get(rootSite);
  if (childSites?.size) {
    for (const childSite of childSites) {
      tree.children.push(createTree(toChildrenEdges, childSite));
    }
  }

  return tree;
};

const createTrees = (graph: ConnectsGraph): Tree[] => {
  const trees: Tree[] = [];
  graph.rootSet.forEach((site) => {
    const tree = createTree(graph.toChildrenEdges, site);
    trees.push(tree);
  });
  return trees;
};

const doPaint = (props: {
  gSelection: Selection<SVGGElement, Tree, any, any>;
  level: number;
  x: number;
  y: number;
  width: number;
  height: number;
}): void => {
  const { gSelection, level, x, y, width, height } = props;
  const keyFunction = (datum: any, i: number) => datum?.site ?? i;

  gSelection
    .selectAll("text")
    .data((d) => [d], keyFunction)
    .join((enter) =>
      enter
        .append("text")
        .text((d) => String(d.site))
        .attr("x", String(x + width / 2))
        .attr("y", String(y + height / 2))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
    );

  gSelection
    .selectAll("g")
    .data((d) => d.children, keyFunction)
    .join((enter) =>
      enter.each(function (d, i, nodes) {
        const gSelection = select(this).datum(d).append("g");
        const childWidth = width / nodes.length;
        const childX = childWidth * i;
        const childY = y + height;
        doPaint({
          gSelection,
          level: level + 1,
          x: childX,
          y: childY,
          height,
          width: childWidth,
        });
      })
    );
};
