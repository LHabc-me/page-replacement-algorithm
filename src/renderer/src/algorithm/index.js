import { generateRandomUniqueIntsExcept } from "./utils";
import { replacePage } from "./core";

// 页表项
class PageTableEntry {
  constructor({ logicalPage, frame }) {
    this.logicalPage = logicalPage; // 逻辑页号
    this.frame = frame; // 页框号（物理块号、帧） -1表示不在工作集内
    this.accessed = false; // 访问位 CLOCK算法使用
    this.lastAccessTime = 0; // 最近访问时间 LRU算法使用
    this.totalAccessCount = 0; // 总访问次数 NRU算法使用
  }
}


// 页表
class PageTable {
  constructor({ logicalPageCount, pageSize }) {
    Object.defineProperty(this, "logicalPageCount", {
      get() {
        return this._logicalPageCount;
      },
      set(value) {
        if (value < 1) {
          throw new Error("逻辑页数必须大于0");
        }
        this._logicalPageCount = value;
        this._reGenerateFrames();
      }
    });
    this.pageSize = pageSize; // 页大小(字节)
    this.pageTableEntries = []; // 页表表项
    this.pageTableEntries.length = logicalPageCount;
    this.logicalPageCount = logicalPageCount; // 逻辑页数
  }

  _reGenerateFrames() {
    // const frames = generateUniqueRandomInt(this.logicalPageCount, 0, 2 * this.logicalPageCount - 1);
    for (let i = 0; i < this.logicalPageCount; i++) {
      this.pageTableEntries[i] = new PageTableEntry({ logicalPage: i, frame: -1 });
    }
  }
}

// 进程
class Process {
  constructor({ logicalPageCount, pageSize, workingSetCount, pageReplacementAlgorithm }) {
    this.pageTable = new PageTable({ logicalPageCount, pageSize }); // 页表
    this.workingSet = []; // 工作集
    this.workingSetCount = workingSetCount; // 工作集大小
    this.pageFault = 0; // 缺页次数
    this.pageHit = 0; // 命中次数
    this.pageFaultRate = 0; // 缺页率
    this.pageReplacementAlgorithm = pageReplacementAlgorithm; // 页面置换算法
  }

  // 访问逻辑地址。如果发生页面置换，返回被置换的页表项
  access(logicalAddress) {
    const logicalPage = Math.floor(logicalAddress / this.pageTable.pageSize);
    const offset = logicalAddress % this.pageTable.pageSize;
    const pageTableEntry = this.pageTable.pageTableEntries[logicalPage]; // 正在访问的页表项
    pageTableEntry.lastAccessTime = Date.now(); // 更新最近访问时间
    pageTableEntry.totalAccessCount++; // 更新总访问次数
    pageTableEntry.accessed = true; // 被访问后，访问位置为1

    this.pageFaultRate = this.pageFault / (this.pageFault + this.pageHit); // 更新缺页率
    if (this.workingSet.includes(logicalPage)) {// 命中
      console.log("命中\nworkingSet=", this.workingSet);
      this.pageHit++;
      return null;
    } else if (this.workingSet.length < this.workingSetCount) { // 未命中，工作集未满
      console.log("工作集未满，直接装入内存\nworkingSet=", this.workingSet);
      this.workingSet.push(logicalPage);
      pageTableEntry.accessed = false; // 装入内存后，访问位置为0
      pageTableEntry.frame = generateRandomUniqueIntsExcept(1, 0, 2 * this.pageTable.logicalPageCount - 1, this.workingSet.map(p => p.frame))[0];
      return pageTableEntry;
    } else if (!this.workingSet.includes(logicalPage)) {
      // 发生缺页，进行页面置换
      console.log("工作集已满，发生缺页，进行页面置换，workingSet=", this.workingSet);
      this.pageFault++;
      return replacePage(pageTableEntry, this.pageTable, this.workingSet, this.pageReplacementAlgorithm);
    }
  }
}


const p = new Process(
  {
    logicalPageCount: 4,
    pageSize: 1,
    workingSetCount: 2,
    pageReplacementAlgorithm: "CLOCK"
  });

p.access();
