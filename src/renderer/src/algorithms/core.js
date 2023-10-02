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
  // if (algorithm !== PAGE_REPLACEMENT_ALGORITHMS.CLOCK)
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

// // 不经常使用页面置换算法
// function replacePageNUR(pageTableEntry, pageTable, workingSet) {
//   const replacedPage = workingSet.reduce((a, b) => {
//     return pageTable.pageTableEntries[a].totalAccessCount < pageTable.pageTableEntries[b].totalAccessCount ? a : b;
//   });
//   const replacedPageTableEntry = pageTable.pageTableEntries[replacedPage];
//   replacedPageTableEntry.accessed = false;
//   pageTableEntry.frame = replacedPageTableEntry.frame;
//   return replacedPageTableEntry;
// }
//
// 时钟页面置换算法
// function replacePageCLOCK(pageTableEntry, pageTable, workingSet) {
//   // 找到第一个访问位为0的页表项，沿途将访问位为1的页表项的访问位置为0
//   let replacedPage = workingSet[0];
//   for (let i = 0; i < workingSet.length; i++) {
//     const pageTableEntry = pageTable.pageTableEntries[workingSet[i]];
//     if (!pageTableEntry.accessed) {
//       replacedPage = workingSet[i];
//       break;
//     }
//     pageTableEntry.accessed = false;
//   }
//   const replacedPageTableEntry = pageTable.pageTableEntries[replacedPage];
//   pageTableEntry.frame = replacedPageTableEntry.frame;
//   return replacedPageTableEntry;
// }

// 不经常使用页面置换算法
function replacePageNUR(pageTableEntry, pageTable, workingSet) {
  // 定义 NRU 类别
  const CATEGORY_NOT_REFERENCED_NOT_MODIFIED = 0;
  const CATEGORY_NOT_REFERENCED_MODIFIED = 1;
  const CATEGORY_REFERENCED_NOT_MODIFIED = 2;
  const CATEGORY_REFERENCED_MODIFIED = 3;

  // 初始化用于跟踪每个类别的数组
  const categories = [[], [], [], []];

  // 将页面分为四个类别
  workingSet.forEach((pageIndex) => {
    const pageEntry = pageTable.pageTableEntries[pageIndex];
    if (!pageEntry.referenced && !pageEntry.modified) {
      categories[CATEGORY_NOT_REFERENCED_NOT_MODIFIED].push(pageIndex);
    } else if (!pageEntry.referenced && pageEntry.modified) {
      categories[CATEGORY_NOT_REFERENCED_MODIFIED].push(pageIndex);
    } else if (pageEntry.referenced && !pageEntry.modified) {
      categories[CATEGORY_REFERENCED_NOT_MODIFIED].push(pageIndex);
    } else {
      categories[CATEGORY_REFERENCED_MODIFIED].push(pageIndex);
    }
  });

  // 选择要替换的页面
  for (let category = 0; category < 4; category++) {
    if (categories[category].length > 0) {
      const replacedPage = categories[category][0]; // 选择最低类别的第一个页面
      const replacedPageTableEntry = pageTable.pageTableEntries[replacedPage];
      replacedPageTableEntry.referenced = false;
      pageTableEntry.frame = replacedPageTableEntry.frame;
      return replacedPageTableEntry;
    }
  }
  return null; // 没有找到可替换的页面
}

// 时钟页面置换算法
function replacePageCLOCK(pageTableEntry, pageTable, workingSet) {
  const clock = pageTable.clockHand;
  console.log("clockHand: " + clock);
  const workingSetLength = workingSet.length;
  console.log("workingSet: " + workingSet);

  while (true) {
    // 获取当前时钟指针位置的页表项
    // const currentEntry = pageTable.pageTableEntries.at(clock);
    // const currentEntry = workingSet[clock];

    // 9.30记录：
    // 1. currentEntry应该是一个number，而不是一个object

    // 10.1记录：
    // 1. 应该对workingSet进行操作，而不是对pageTable进行操作
    console.log("workingSet[clock]: " + workingSet[clock]);
    const currentEntry = pageTable.pageTableEntries[workingSet[clock]];


    if (!currentEntry.accessed) {
      // 找到一个访问位为0的页表项，替换它
      pageTableEntry.frame = currentEntry.frame;
      // currentEntry.accessed = true;
      // console.log("currentEntry: " + pageTable.pageTableEntries.indexOf(currentEntry));
      console.log("currentEntry: " + currentEntry.logicalPage);
      // 更新时钟指针位置，确保在环中循环
      // pageTable._setClockHand(((clock + 1) % workingSetLength));
      // console.log("缺页后clockHand: " + pageTable.clockHand);
      // 没找到currentEntry，因为currentEntry是object，而workingSet是number，因此workingSet.indexOf(currentEntry)返回-1

      return currentEntry;
    }

    // 将当前页表项的访问位置为0
    currentEntry.accessed = false;
    console.log("currentEntry.accessed: " + pageTable.pageTableEntries[workingSet[clock]].accessed);

    // 更新时钟指针位置，确保在环中循环
    pageTable._setClockHand(((clock + 1) % workingSetLength));
    console.log("缺页后clockHand: " + pageTable.clockHand);
  }
}


export { replacePage, PAGE_REPLACEMENT_ALGORITHMS };
