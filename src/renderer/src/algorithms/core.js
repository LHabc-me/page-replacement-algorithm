// 页面置换算法
const PAGE_REPLACEMENT_ALGORITHMS = {
  FIFO: "FIFO",
  LRU: "LRU",
  NUR: "NUR",
  CLOCK: "CLOCK"
};

function replacePage(pageTableEntry, pageTable, workingSet, algorithm) {
  let result;
  switch (algorithm) {
    case PAGE_REPLACEMENT_ALGORITHMS.FIFO:
      result = replacePageFIFO(pageTableEntry, pageTable, workingSet);
      break;
    case PAGE_REPLACEMENT_ALGORITHMS.LRU:
      result = replacePageLRU(pageTableEntry, pageTable, workingSet);
      break;
    case PAGE_REPLACEMENT_ALGORITHMS.NUR:
      result = replacePageNUR(pageTableEntry, pageTable, workingSet);
      break;
    case PAGE_REPLACEMENT_ALGORITHMS.CLOCK:
      result = replacePageCLOCK(pageTableEntry, pageTable, workingSet);
      break;
    default:
      throw new Error("未实现的页面置换算法");

  }
  result.frame = -1;
  workingSet.splice(workingSet.findIndex(i => i === result.logicalPage), 1);
  workingSet.push(pageTableEntry.logicalPage);
  return result;
}

// 先进先出页面置换算法
function replacePageFIFO(pageTableEntry, pageTable, workingSet) {
  const replacedPage = workingSet[0];
  const replacedPageTableEntry = pageTable.pageTableEntries[replacedPage];
  replacedPageTableEntry.accessed = false;
  pageTableEntry.frame = replacedPageTableEntry.frame;
  return replacedPageTableEntry;
}

// 最近最久未使用页面置换算法
function replacePageLRU(pageTableEntry, pageTable, workingSet) {
  const replacedPage = workingSet.reduce((a, b) => {
    return pageTable.pageTableEntries[a].lastAccessTime < pageTable.pageTableEntries[b].lastAccessTime ? a : b;
  });
  const replacedPageTableEntry = pageTable.pageTableEntries[replacedPage];
  replacedPageTableEntry.accessed = false;
  pageTableEntry.frame = replacedPageTableEntry.frame;
  return replacedPageTableEntry;
}

// 不经常使用页面置换算法
function replacePageNUR(pageTableEntry, pageTable, workingSet) {
  const replacedPage = workingSet.reduce((a, b) => {
    return pageTable.pageTableEntries[a].totalAccessCount < pageTable.pageTableEntries[b].totalAccessCount ? a : b;
  });
  const replacedPageTableEntry = pageTable.pageTableEntries[replacedPage];
  replacedPageTableEntry.accessed = false;
  pageTableEntry.frame = replacedPageTableEntry.frame;
  return replacedPageTableEntry;
}

// 时钟页面置换算法
function replacePageCLOCK(pageTableEntry, pageTable, workingSet) {
  // 找到第一个访问位为0的页表项，沿途将访问位为1的页表项的访问位置为0
  let replacedPage = workingSet[0];
  for (let i = 0; i < workingSet.length; i++) {
    const pageTableEntry = pageTable.pageTableEntries[workingSet[i]];
    if (!pageTableEntry.accessed) {
      replacedPage = workingSet[i];
      break;
    }
    pageTableEntry.accessed = false;
  }
  const replacedPageTableEntry = pageTable.pageTableEntries[replacedPage];
  pageTableEntry.frame = replacedPageTableEntry.frame;
  return replacedPageTableEntry;
}

export { replacePage, PAGE_REPLACEMENT_ALGORITHMS };
