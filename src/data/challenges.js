export const challenges = [

  // CATEGORY: ALGORITHMS (8 Challenges)
  
  {
    id: 'two-sum',
    title: '01. Two Sum',
    category: 'algorithms',
    difficulty: 'easy',
    language: 'both',
    estimatedMinutes: 15,
    prompt: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`. You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= target <= 10^9'],
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' }],
    testCases: [
      { id: 'tc1', input: '[2,7,11,15]\n9', expectedOutput: '0 1', points: 50 },
      { id: 'tc2', input: '[3,2,4]\n6', expectedOutput: '1 2', points: 50 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(n)' },
    tags: ['array', 'hash-map'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Try using a hash map to store seen values.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'valid-parentheses',
    title: '02. Valid Parentheses',
    category: 'algorithms',
    difficulty: 'easy',
    language: 'both',
    estimatedMinutes: 15,
    prompt: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.`,
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only.'],
    examples: [{ input: 's = "()[]{}"', output: 'true', explanation: 'All brackets are closed correctly.' }],
    testCases: [
      { id: 'tc1', input: '()[]{}', expectedOutput: 'true', points: 33 },
      { id: 'tc2', input: '(]', expectedOutput: 'false', points: 33 },
      { id: 'tc3', input: '([)]', expectedOutput: 'false', points: 34 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(n)' },
    tags: ['stack', 'string'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Use a stack to keep track of open brackets.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'longest-substring',
    title: '03. Longest Substring Without Repeating Characters',
    category: 'algorithms',
    difficulty: 'medium',
    language: 'both',
    estimatedMinutes: 25,
    prompt: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }],
    testCases: [
      { id: 'tc1', input: 'abcabcbb', expectedOutput: '3', points: 33 },
      { id: 'tc2', input: 'bbbbb', expectedOutput: '1', points: 33 },
      { id: 'tc3', input: 'pwwkew', expectedOutput: '3', points: 34 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(min(m, n))' },
    tags: ['sliding-window', 'hash-map'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Use a sliding window approach with a set or map.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'merge-intervals',
    title: '04. Merge Intervals',
    category: 'algorithms',
    difficulty: 'medium',
    language: 'both',
    estimatedMinutes: 30,
    prompt: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2'],
    examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap.' }],
    testCases: [
      { id: 'tc1', input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', points: 50 },
      { id: 'tc2', input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]', points: 50 }
    ],
    optimalComplexity: { time: 'O(n log n)', space: 'O(log n)' },
    tags: ['array', 'sorting'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Sort the intervals by their start times first.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'number-of-islands',
    title: '05. Number of Islands',
    category: 'algorithms',
    difficulty: 'medium',
    language: 'both',
    estimatedMinutes: 30,
    prompt: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'],
    examples: [{ input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: '2', explanation: 'Two distinct islands.' }],
    testCases: [
      { id: 'tc1', input: '[["1","1","0"],["1","0","0"],["0","0","1"]]', expectedOutput: '2', points: 50 },
      { id: 'tc2', input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', expectedOutput: '1', points: 50 }
    ],
    optimalComplexity: { time: 'O(m * n)', space: 'O(m * n)' },
    tags: ['graph', 'dfs', 'bfs'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Iterate through the grid and perform DFS/BFS when you find a "1".'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lru-cache',
    title: '06. LRU Cache',
    category: 'algorithms',
    difficulty: 'hard',
    language: 'both',
    estimatedMinutes: 45,
    prompt: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the \`LRUCache\` class: \`LRUCache(int capacity)\` initializes the cache, \`int get(int key)\` returns the value of the key if it exists, otherwise -1. \`void put(int key, int value)\` updates or inserts the value if the key is not already present. When the cache reaches capacity, it should invalidate the least recently used item.`,
    constraints: ['1 <= capacity <= 3000', 'get and put must each run in O(1) average time complexity.'],
    examples: [{ input: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)', output: 'null, null, null, 1, null, -1', explanation: 'Evicts key 2.' }],
    testCases: [
      { id: 'tc1', input: 'capacity:2\nput:1:1\nput:2:2\nget:1\nput:3:3\nget:2', expectedOutput: '1\n-1', points: 100 }
    ],
    optimalComplexity: { time: 'O(1)', space: 'O(capacity)' },
    tags: ['hash-map', 'doubly-linked-list', 'design'],
    evaluationFocus: ['efficiency', 'correctness'],
    hints: ['Combine a Hash Map with a Doubly Linked List.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'word-ladder',
    title: '07. Word Ladder',
    category: 'algorithms',
    difficulty: 'hard',
    language: 'both',
    estimatedMinutes: 45,
    prompt: `A transformation sequence from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words such that every adjacent pair differs by a single letter. Return the number of words in the shortest transformation sequence from \`beginWord\` to \`endWord\`, or 0 if no such sequence exists.`,
    constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', 'All words have the same length.'],
    examples: [{ input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog"' }],
    testCases: [
      { id: 'tc1', input: 'hit\ncog\nhot,dot,dog,lot,log,cog', expectedOutput: '5', points: 50 },
      { id: 'tc2', input: 'hit\ncog\nhot,dot,dog,lot,log', expectedOutput: '0', points: 50 }
    ],
    optimalComplexity: { time: 'O(M^2 * N)', space: 'O(M^2 * N)' },
    tags: ['graph', 'bfs'],
    evaluationFocus: ['efficiency', 'correctness'],
    hints: ['Use Breadth-First Search (BFS) to find the shortest path.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'median-two-sorted-arrays',
    title: '08. Median of Two Sorted Arrays',
    category: 'algorithms',
    difficulty: 'expert',
    language: 'both',
    estimatedMinutes: 50,
    prompt: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).`,
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m, n <= 1000'],
    examples: [{ input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'merged array = [1,2,3] and median is 2.' }],
    testCases: [
      { id: 'tc1', input: '[1,3]\n[2]', expectedOutput: '2', points: 50 },
      { id: 'tc2', input: '[1,2]\n[3,4]', expectedOutput: '2.5', points: 50 }
    ],
    optimalComplexity: { time: 'O(log(min(m, n)))', space: 'O(1)' },
    tags: ['array', 'binary-search', 'divide-and-conquer'],
    evaluationFocus: ['efficiency', 'explanation'],
    hints: ['Use binary search to partition the smaller array.'],
    createdAt: '2025-01-01T00:00:00Z'
  },

  
  // CATEGORY: DATA STRUCTURES (5 Challenges)
  
  {
    id: 'stack-using-queues',
    title: '09. Implement a Stack Using Two Queues',
    category: 'data-structures',
    difficulty: 'easy',
    language: 'both',
    estimatedMinutes: 20,
    prompt: `Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (\`push\`, \`top\`, \`pop\`, and \`empty\`).`,
    constraints: ['You must use only standard operations of a queue.', 'At most 100 calls will be made to the methods.'],
    examples: [{ input: 'push(1), push(2), top(), pop(), empty()', output: '2, 2, false', explanation: 'Standard LIFO behavior.' }],
    testCases: [
      { id: 'tc1', input: 'push:1\npush:2\ntop\npop\nempty', expectedOutput: '2\n2\nfalse', points: 100 }
    ],
    optimalComplexity: { time: 'O(n) for push, O(1) for pop', space: 'O(n)' },
    tags: ['design', 'stack', 'queue'],
    evaluationFocus: ['correctness', 'readability'],
    hints: ['Make the push operation costly by moving elements between the two queues.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'design-min-heap',
    title: '10. Design a Min-Heap',
    category: 'data-structures',
    difficulty: 'medium',
    language: 'both',
    estimatedMinutes: 35,
    prompt: `Design a Min-Heap class from scratch (using an array). Implement \`insert(val)\`, \`extractMin()\`, and \`peek()\` methods.`,
    constraints: ['Do not use built-in priority queue libraries.'],
    examples: [{ input: 'insert(3), insert(1), insert(2), extractMin()', output: '1', explanation: '1 is the smallest element.' }],
    testCases: [
      { id: 'tc1', input: 'insert:3\ninsert:1\ninsert:2\nextractMin\npeek', expectedOutput: '1\n2', points: 100 }
    ],
    optimalComplexity: { time: 'O(log n) insert/extract', space: 'O(n)' },
    tags: ['heap', 'design'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Remember parent index is (i-1)/2, left child is 2*i+1.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'implement-trie',
    title: '11. Build a Trie (Prefix Tree)',
    category: 'data-structures',
    difficulty: 'medium',
    language: 'both',
    estimatedMinutes: 30,
    prompt: `Implement a Trie class with \`insert(word)\`, \`search(word)\`, and \`startsWith(prefix)\` methods.`,
    constraints: ['1 <= word.length <= 2000', 'words contain only lowercase letters.'],
    examples: [{ input: 'insert("apple"), search("apple"), startsWith("app")', output: 'true, true', explanation: 'Standard trie behavior.' }],
    testCases: [
      { id: 'tc1', input: 'insert:apple\nsearch:apple\nstartsWith:app\nsearch:app', expectedOutput: 'true\ntrue\nfalse', points: 100 }
    ],
    optimalComplexity: { time: 'O(m) per operation', space: 'O(m * n)' },
    tags: ['tree', 'design', 'string'],
    evaluationFocus: ['correctness', 'readability'],
    hints: ['Use a hash map or array size 26 at each node.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'serialize-deserialize-binary-tree',
    title: '12. Serialize and Deserialize a Binary Tree',
    category: 'data-structures',
    difficulty: 'hard',
    language: 'both',
    estimatedMinutes: 45,
    prompt: `Design an algorithm to serialize and deserialize a binary tree. Serialization is the process of converting a data structure into a string. You just need to ensure a tree can be serialized to a string and deserialized back.`,
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].'],
    examples: [{ input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]', explanation: 'Tree survives round-trip.' }],
    testCases: [
      { id: 'tc1', input: '1,2,3,null,null,4,5', expectedOutput: '1,2,3,null,null,4,5', points: 100 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(n)' },
    tags: ['tree', 'design', 'bfs', 'dfs'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Use Pre-order traversal or BFS (Level-order) and mark nulls explicitly.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'circular-buffer',
    title: '13. Build a Circular Buffer with Dynamic Resize',
    category: 'data-structures',
    difficulty: 'hard',
    language: 'both',
    estimatedMinutes: 45,
    prompt: `Design a circular buffer (ring buffer) that automatically doubles its capacity when full. Implement \`enqueue(val)\`, \`dequeue()\`, and \`getSize()\`.`,
    constraints: ['Initial capacity should be provided.', 'Must wrap around using modulo arithmetic.'],
    examples: [{ input: 'init(2), enq(1), enq(2), enq(3), deq()', output: '1', explanation: 'enq(3) triggers resize.' }],
    testCases: [
      { id: 'tc1', input: 'init:2\nenq:1\nenq:2\nenq:3\ndeq\ngetSize', expectedOutput: '1\n2', points: 100 }
    ],
    optimalComplexity: { time: 'O(1) amortized', space: 'O(n)' },
    tags: ['array', 'design'],
    evaluationFocus: ['efficiency', 'correctness'],
    hints: ['When resizing, remember to un-wrap the circular elements into a straight array.'],
    createdAt: '2025-01-01T00:00:00Z'
  },

  
  // CATEGORY: FRONTEND-SPECIFIC (7 Challenges)
  
  {
    id: 'debounce',
    title: '14. Implement debounce from scratch',
    category: 'frontend',
    difficulty: 'easy',
    language: 'javascript',
    estimatedMinutes: 15,
    prompt: `Write a function \`debounce(fn, delay)\` that returns a debounced version of \`fn\`. The debounced function should delay invoking \`fn\` until after \`delay\` milliseconds have elapsed since the last time the debounced function was invoked.`,
    constraints: ['Must handle \`this\` context and arguments correctly.'],
    examples: [{ input: 'let d = debounce(console.log, 100); d(1); d(2);', output: 'Logs "2" after 100ms', explanation: 'First call is cancelled.' }],
    testCases: [
      { id: 'tc1', input: 'mock_time_test', expectedOutput: 'true', points: 100 }
    ],
    optimalComplexity: { time: 'O(1)', space: 'O(1)' },
    tags: ['javascript-fundamentals', 'closures', 'timers'],
    evaluationFocus: ['correctness', 'readability'],
    hints: ['Use setTimeout and clearTimeout.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'throttle',
    title: '15. Implement throttle from scratch',
    category: 'frontend',
    difficulty: 'easy',
    language: 'javascript',
    estimatedMinutes: 20,
    prompt: `Write a function \`throttle(fn, limit)\` that returns a throttled version of \`fn\`. It should guarantee that \`fn\` is executed at most once every \`limit\` milliseconds.`,
    constraints: ['Must handle arguments and context.', 'Should fire immediately on first call.'],
    examples: [{ input: 'let t = throttle(log, 100); t(1); t(2);', output: 'Logs 1 immediately, ignores 2 if within 100ms.', explanation: 'Standard throttle behavior.' }],
    testCases: [
      { id: 'tc1', input: 'mock_time_test', expectedOutput: 'true', points: 100 }
    ],
    optimalComplexity: { time: 'O(1)', space: 'O(1)' },
    tags: ['javascript-fundamentals', 'closures', 'timers'],
    evaluationFocus: ['correctness', 'readability'],
    hints: ['Keep track of a `lastRan` timestamp or a `waiting` boolean flag.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'deep-clone',
    title: '16. Deep Clone a Nested Object',
    category: 'frontend',
    difficulty: 'medium',
    language: 'javascript',
    estimatedMinutes: 25,
    prompt: `Write a function \`deepClone(obj)\` that takes an object and returns a deep copy of it without using \`JSON.parse(JSON.stringify())\` or \`structuredClone\`. Must handle nested objects and arrays.`,
    constraints: ['Maximum nesting depth 100.'],
    examples: [{ input: 'a = {b: {c: 1}}', output: 'deep clone of a', explanation: 'Mutating the clone does not affect original.' }],
    testCases: [
      { id: 'tc1', input: '{"a": 1, "b": [2, 3]}', expectedOutput: 'deep-match', points: 100 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(n)' },
    tags: ['recursion', 'objects'],
    evaluationFocus: ['correctness', 'edge-cases'],
    hints: ['Use recursion and Array.isArray().'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'event-emitter',
    title: '17. Write a Custom EventEmitter class',
    category: 'frontend',
    difficulty: 'medium',
    language: 'javascript',
    estimatedMinutes: 25,
    prompt: `Create an \`EventEmitter\` class with \`on(eventName, callback)\`, \`emit(eventName, ...args)\`, and \`off(eventName, callback)\` methods.`,
    constraints: ['Multiple listeners can subscribe to the same event.'],
    examples: [{ input: 'ee.on("foo", cb); ee.emit("foo", 1); ee.off("foo", cb);', output: 'cb receives 1. After off, it is no longer called.', explanation: 'Pub/Sub pattern.' }],
    testCases: [
      { id: 'tc1', input: 'on:foo\nemit:foo:1\noff:foo\nemit:foo:2', expectedOutput: '1', points: 100 }
    ],
    optimalComplexity: { time: 'O(1) emit/on, O(n) off', space: 'O(n)' },
    tags: ['design-patterns', 'javascript-fundamentals'],
    evaluationFocus: ['correctness', 'readability'],
    hints: ['Store events in an object where keys are event names and values are arrays of callbacks.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'promise-all-settled',
    title: '18. Implement Promise.allSettled from scratch',
    category: 'frontend',
    difficulty: 'medium',
    language: 'javascript',
    estimatedMinutes: 25,
    prompt: `Write a function \`myAllSettled(promises)\` that takes an array of promises and returns a single promise. This returned promise resolves when all input promises have settled (either fulfilled or rejected), with an array of objects describing the outcome of each promise.`,
    constraints: ['Do not use the native Promise.allSettled().'],
    examples: [{ input: '[Promise.resolve(1), Promise.reject(2)]', output: '[{status:"fulfilled", value:1}, {status:"rejected", reason:2}]', explanation: 'Standard allSettled.' }],
    testCases: [
      { id: 'tc1', input: 'resolve:1\nreject:2', expectedOutput: 'fulfilled:1\nrejected:2', points: 100 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(n)' },
    tags: ['async', 'promises'],
    evaluationFocus: ['correctness', 'edge-cases'],
    hints: ['Map each promise to catch its error so that Promise.all can be used under the hood, or track completions manually.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'virtual-scroll',
    title: '19. Build a Virtual Scroll (Logic Engine)',
    category: 'frontend',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 40,
    prompt: `Implement the math logic for a Virtual Scroll component. Write a function \`getVisibleRange(scrollTop, viewportHeight, itemHeight, totalItems)\` that returns \`{ startIndex, endIndex, offsetY }\`. \`startIndex\` and \`endIndex\` represent the items currently visible (including partials), and \`offsetY\` is the absolute top position of the \`startIndex\` item.`,
    constraints: ['Assume items have a fixed, identical height.'],
    examples: [{ input: 'scrollTop: 150, viewport: 200, itemHeight: 50, total: 1000', output: '{ startIndex: 3, endIndex: 7, offsetY: 150 }', explanation: 'Indexes 3 to 7 are visible.' }],
    testCases: [
      { id: 'tc1', input: '150,200,50,1000', expectedOutput: '3,7,150', points: 100 }
    ],
    optimalComplexity: { time: 'O(1)', space: 'O(1)' },
    tags: ['math', 'ui-performance'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Divide scrollTop by itemHeight to find the start index.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'infinite-scroll-hook',
    title: '20. Infinite Scroll Simulation',
    category: 'frontend',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 40,
    prompt: `Simulate the core logic of an IntersectionObserver infinite scroll. Write a function \`processIntersections(events, totalItems, itemsPerPage)\` that takes an array of boolean \`isIntersecting\` events fired over time from the bottom observer. It should return an array of "page numbers" fetched. It should NOT fetch if it has reached \`totalItems\`, and should NOT fetch if a fetch is already "in flight" (simulate flight time by skipping events immediately following a fetch until the next event).`,
    constraints: ['Assume fetching takes 1 unit of time (1 subsequent event).'],
    examples: [{ input: 'events=[true, true, false, true], total=30, perPage=10', output: '[1, 2, 3]', explanation: 'Debounces/throttles fetches appropriately.' }],
    testCases: [
      { id: 'tc1', input: 'true,true,false,true\n30\n10', expectedOutput: '1,2,3', points: 100 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(n)' },
    tags: ['state-management', 'ui-performance'],
    evaluationFocus: ['correctness', 'explanation'],
    hints: ['Track an `isLoading` state variable conceptually within your loop.'],
    createdAt: '2025-01-01T00:00:00Z'
  },

  
  // CATEGORY: DEBUGGING (5 Challenges)
  
  {
    id: 'react-memory-leak',
    title: '21. Fix Memory Leak in React Component',
    category: 'debugging',
    difficulty: 'medium',
    language: 'javascript',
    mode: 'debug',
    estimatedMinutes: 15,
    brokenCode: `function Timer() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  }, []);
  return <div>{count}</div>;
}`,
    prompt: `The provided React component sets up a timer but introduces a severe memory leak. Find the bug, explain why it happens, and provide the corrected code.`,
    constraints: ['Must use functional React components.'],
    examples: [],
    testCases: [{ id: 'tc1', input: 'conceptual', expectedOutput: 'cleared', points: 100 }],
    optimalComplexity: { time: 'O(1)', space: 'O(1)' },
    tags: ['react', 'hooks', 'memory-leak'],
    evaluationFocus: ['explanation', 'correctness'],
    hints: ['What happens when the component unmounts?'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'async-race-condition',
    title: '22. Fix Race Condition in Fetch Handler',
    category: 'debugging',
    difficulty: 'medium',
    language: 'javascript',
    mode: 'debug',
    estimatedMinutes: 20,
    brokenCode: `function UserProfile({ userId }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/users/' + userId);
      const json = await response.json();
      setData(json);
    }
    fetchData();
  }, [userId]);
  return <div>{data?.name}</div>;
}`,
    prompt: `This component fetches user data when \`userId\` changes. However, if \`userId\` changes rapidly, older slower requests might resolve *after* newer faster requests, resulting in stale data overwriting correct data (a race condition). Fix the bug.`,
    constraints: ['Ensure network requests are handled safely across re-renders.'],
    examples: [],
    testCases: [{ id: 'tc1', input: 'conceptual', expectedOutput: 'abort-controller-or-flag', points: 100 }],
    optimalComplexity: { time: 'O(1)', space: 'O(1)' },
    tags: ['react', 'async', 'race-condition'],
    evaluationFocus: ['explanation', 'security'],
    hints: ['Consider using an AbortController or a boolean ignore flag.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'binary-search-bug',
    title: '23. Off-By-One Binary Search',
    category: 'debugging',
    difficulty: 'easy',
    language: 'javascript',
    mode: 'debug',
    estimatedMinutes: 10,
    brokenCode: `function binarySearch(arr, target) {
  let left = 0; let right = arr.length;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid;
    else right = mid;
  }
  return -1;
}`,
    prompt: `The provided binary search contains multiple bugs causing infinite loops and off-by-one errors. Fix the code and explain the bugs.`,
    constraints: ['arr is sorted in ascending order.'],
    examples: [{ input: 'arr = [1, 2, 3], target = 3', output: '2', explanation: 'Broken code will loop infinitely.' }],
    testCases: [
      { id: 'tc1', input: '[1,2,3,4,5]\n5', expectedOutput: '4', points: 100 }
    ],
    optimalComplexity: { time: 'O(log n)', space: 'O(1)' },
    tags: ['binary-search', 'infinite-loop'],
    evaluationFocus: ['explanation', 'correctness'],
    hints: ['Check the initialization of `right` and how `left` and `right` are updated inside the loop.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'closure-scope-loop',
    title: '24. Debug Closure Scope in For-Loop',
    category: 'debugging',
    difficulty: 'easy',
    language: 'javascript',
    mode: 'debug',
    estimatedMinutes: 10,
    brokenCode: `function printNumbers() {
  for (var i = 0; i < 3; i++) {
    setTimeout(function() {
      console.log(i);
    }, 100);
  }
}`,
    prompt: `The developer expected this code to print 0, 1, 2. Instead, it prints 3, 3, 3. Identify the scope issue, explain why it happens, and provide the correct code.`,
    constraints: ['Output must be 0, then 1, then 2.'],
    examples: [],
    testCases: [{ id: 'tc1', input: 'conceptual', expectedOutput: '0\n1\n2', points: 100 }],
    optimalComplexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['javascript-fundamentals', 'closures'],
    evaluationFocus: ['explanation', 'correctness'],
    hints: ['Think about the difference between `var` and block-scoped declarations like `let`.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'react-stale-closure',
    title: '25. Fix Stale Closure in React useEffect',
    category: 'debugging',
    difficulty: 'medium',
    language: 'javascript',
    mode: 'debug',
    estimatedMinutes: 15,
    brokenCode: `function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []); // Empty deps array
  return <div>{count}</div>;
}`,
    prompt: `The counter increments to 1 and then stops. The interval continues running, but the UI never updates past 1. Find the stale closure bug, explain the React hook lifecycle concept violated here, and fix it.`,
    constraints: ['Must use setInterval correctly with React state.'],
    examples: [],
    testCases: [{ id: 'tc1', input: 'conceptual', expectedOutput: 'functional-update-or-deps', points: 100 }],
    optimalComplexity: { time: 'O(1)', space: 'O(1)' },
    tags: ['react', 'hooks', 'closures'],
    evaluationFocus: ['explanation', 'correctness'],
    hints: ['Look at how `setCount` is used. Can you update state based on the *previous* state without reading the state variable directly?'],
    createdAt: '2025-01-01T00:00:00Z'
  },

  // CATEGORY: SYSTEM DESIGN (IN CODE) (5 Challenges)
  
  {
    id: 'token-bucket-limiter',
    title: '26. Implement a Token Bucket Rate Limiter',
    category: 'system-design',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 45,
    prompt: `Implement a Token Bucket Rate Limiter class in memory. Your \`RateLimiter\` class should be initialized with \`capacity\` and \`refillRate\`. Implement \`allowRequest(clientId)\`. Do not use \`setInterval\` for refilling; calculate tokens lazily based on timestamps.`,
    constraints: ['Lazy calculation based on timestamps is required to prevent memory leaks.'],
    examples: [{ input: 'limiter = new RateLimiter(5, 1); limiter.allowRequest("user1");', output: 'true', explanation: 'Costs 1 token.' }],
    testCases: [
      { id: 'tc1', input: 'init:5:1\nreq:u1\nreq:u1\nreq:u1\nreq:u1\nreq:u1\nreq:u1', expectedOutput: 'true\ntrue\ntrue\ntrue\ntrue\nfalse', points: 100 }
    ],
    optimalComplexity: { time: 'O(1)', space: 'O(C)' },
    tags: ['rate-limiting', 'lazy-evaluation'],
    evaluationFocus: ['correctness', 'efficiency', 'security'],
    hints: ['Store the `lastRefillTimestamp` for each client.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'kv-store-ttl',
    title: '27. Build an In-Memory Key-Value Store with TTL',
    category: 'system-design',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 40,
    prompt: `Build an in-memory Key-Value store that supports Expiration. Implement \`set(key, value, durationInMs)\`, \`get(key)\` (returns null if expired), and \`cleanup()\` (removes all expired keys to free memory).`,
    constraints: ['Keys should not be retrievable after duration passes.', '`get` should lazily evaluate expiration.'],
    examples: [{ input: 'set("a", 1, 100); get("a"); /* wait 200ms */ get("a");', output: '1, null', explanation: 'Expires after 100ms.' }],
    testCases: [
      { id: 'tc1', input: 'set:a:1:100\nget:a\nsleep:150\nget:a', expectedOutput: '1\nnull', points: 100 }
    ],
    optimalComplexity: { time: 'O(1) get/set', space: 'O(n)' },
    tags: ['caching', 'hash-map'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Store an object containing the value and the expiration timestamp.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'job-queue-backoff',
    title: '28. Job Queue with Exponential Backoff',
    category: 'system-design',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 50,
    prompt: `Implement an asynchronous Job Queue execution engine. \`addJob(jobFn)\` adds a function that returns a Promise. \`start()\` begins execution with a concurrency of 1. If a job fails, retry it up to 3 times, waiting \`2^retryCount * 100\` milliseconds between attempts.`,
    constraints: ['Must handle asynchronous jobs properly.', 'Do not block the main thread during backoff waits.'],
    examples: [{ input: 'Job fails twice, succeeds third time.', output: 'Executed at 0ms, 100ms, 300ms. Job succeeds.', explanation: 'Backoff delays applied.' }],
    testCases: [
      { id: 'tc1', input: 'conceptual_mock', expectedOutput: 'success', points: 100 }
    ],
    optimalComplexity: { time: 'O(n) per job', space: 'O(n) queue size' },
    tags: ['async', 'queue', 'retry'],
    evaluationFocus: ['correctness', 'readability'],
    hints: ['Use recursive async functions or a while loop with `await sleep()`.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'pub-sub-broker',
    title: '29. Build a Pub/Sub Message Broker',
    category: 'system-design',
    difficulty: 'expert',
    language: 'javascript',
    estimatedMinutes: 50,
    prompt: `Design an advanced Pub/Sub broker from scratch. Implement \`subscribe(topic, callback)\` which returns a unique subscription ID. Implement \`publish(topic, message)\`. Add wildcard topic support (e.g., \`app.logger.*\`) so publishing to \`app.logger.error\` triggers wildcard subscribers.`,
    constraints: ['Must efficiently match exact strings and single-level wildcards (*).'],
    examples: [{ input: 'sub("sys.*"), pub("sys.cpu", "high")', output: 'Wildcard sub receives "high"', explanation: 'Matches sys.cpu' }],
    testCases: [
      { id: 'tc1', input: 'sub:sys.*\npub:sys.cpu:90\npub:sys.ram:50', expectedOutput: '90\n50', points: 100 }
    ],
    optimalComplexity: { time: 'O(S) where S is number of matching subscribers', space: 'O(topics + subscribers)' },
    tags: ['design-patterns', 'events', 'trie'],
    evaluationFocus: ['efficiency', 'correctness'],
    hints: ['For wildcard routing, consider using a Map of Maps, or a Trie structure where each node is a topic segment.'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'event-sourcing-log',
    title: '30. Simple Event Sourcing Log',
    category: 'system-design',
    difficulty: 'expert',
    language: 'javascript',
    estimatedMinutes: 60,
    prompt: `Design an event-sourced aggregate. You have an \`Account\` entity. Instead of storing its balance directly, implement an \`EventStore\` class. \`appendEvent(accountId, eventType, payload)\` saves an immutable event (e.g., "DEPOSIT", { amount: 100 }). \`getAggregate(accountId)\` replays all events for that account sequentially to calculate and return the current state of the account. Add a \`createSnapshot(accountId)\` method to optimize replays.`,
    constraints: ['Events must be replayed in insertion order.', 'Snapshots should effectively truncate the replay history needed.'],
    examples: [{ input: 'append(1, "DEP", 100); append(1, "WITHDRAW", 20); getAgg(1)', output: 'balance: 80', explanation: 'Calculated via replay.' }],
    testCases: [
      { id: 'tc1', input: 'app:1:DEP:100\napp:1:WIT:20\nget:1', expectedOutput: '80', points: 100 }
    ],
    optimalComplexity: { time: 'O(E) to rebuild state where E is events since last snapshot', space: 'O(total events)' },
    tags: ['architecture', 'event-sourcing'],
    evaluationFocus: ['correctness', 'readability', 'explanation'],
    hints: ['Store events in an array. A snapshot is just an object `{ lastEventIndex, state }`.'],
    createdAt: '2025-01-01T00:00:00Z'
  },

  // CATEGORY: BACKEND (3 Challenges)
  
  {
    id: 'basic-url-router',
    title: '31. Build a Basic URL Router',
    category: 'backend',
    difficulty: 'easy',
    language: 'javascript',
    estimatedMinutes: 20,
    prompt: `Design a basic backend URL router. Write a function \`matchRoute(registeredRoutes, incomingUrl)\` that takes an array of route string patterns (e.g., \`["/users", "/users/:id", "/posts/:id/comments"]\`) and an incoming URL string.\n\nIf the URL matches a registered route, return an object containing the matched route pattern and a parsed \`params\` object. If there is no match, return \`null\`.\n\nFor example, an incoming URL of \`/users/42\` should match the \`/users/:id\` route and extract \`{ id: "42" }\`.`,
    constraints: [
      'Path parameters are denoted by a colon (:) followed by the parameter name.',
      'Routes must match exactly (ignoring trailing slashes).',
      'Assume valid URL paths without query strings for this exercise.'
    ],
    examples: [
      { input: 'routes = ["/users/:id"], url = "/users/42"', output: '{ route: "/users/:id", params: { id: "42" } }', explanation: 'The pattern matches and extracts 42 as the id.' },
      { input: 'routes = ["/users"], url = "/users/42"', output: 'null', explanation: 'Does not match the static /users route.' }
    ],
    testCases: [
      { id: 'tc1', input: '["/users/:id"]\n"/users/123"', expectedOutput: '{"route":"/users/:id","params":{"id":"123"}}', points: 30 },
      { id: 'tc2', input: '["/posts/:postId/comments/:commentId"]\n"/posts/1/comments/5"', expectedOutput: '{"route":"/posts/:postId/comments/:commentId","params":{"postId":"1","commentId":"5"}}', points: 40 },
      { id: 'tc3', input: '["/about", "/contact"]\n"/about/team"', expectedOutput: 'null', points: 30 }
    ],
    optimalComplexity: { time: 'O(R * L) where R is number of routes and L is length of URL', space: 'O(P) for parsed parameters' },
    tags: ['routing', 'string-parsing', 'api'],
    evaluationFocus: ['correctness', 'readability'],
    hints: ['Try splitting both the registered route and the incoming URL by the "/" character and comparing them segment by segment.'],
    createdAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 'in-memory-ttl-cache',
    title: '32. In-Memory Cache with TTL',
    category: 'backend',
    difficulty: 'medium',
    language: 'javascript',
    estimatedMinutes: 35,
    prompt: `Implement a time-to-live (TTL) cache system commonly used in backend services to reduce database load.\n\nCreate a \`Cache\` class with the following methods:\n- \`set(key, value, ttl)\`: Stores a key-value pair. \`ttl\` is the time-to-live in milliseconds.\n- \`get(key)\`: Returns the value if it exists and has not expired. If it has expired or does not exist, return \`-1\`.\n- \`count()\`: Returns the number of unexpired keys currently in the cache.\n\nKeys expire exactly \`ttl\` milliseconds after they are set.`,
    constraints: [
      'The cache must handle potentially thousands of keys.',
      'Expired keys should ideally be cleaned up so they do not cause a memory leak over time.'
    ],
    examples: [
      { input: 'cache.set("user_1", "data", 100); cache.get("user_1"); // wait 150ms; cache.get("user_1")', output: '"data" then -1', explanation: 'The key expires after 100ms, so the second get() returns -1.' }
    ],
    testCases: [
      { id: 'tc1', input: 'set:A:10:100\nget:A\nwait:150\nget:A', expectedOutput: '10\n-1', points: 50 },
      { id: 'tc2', input: 'set:B:20:50\nset:C:30:200\nwait:100\ncount', expectedOutput: '1', points: 50 }
    ],
    optimalComplexity: { time: 'O(1) for get and set', space: 'O(N) where N is number of active keys' },
    tags: ['caching', 'hash-map', 'timers'],
    evaluationFocus: ['correctness', 'efficiency', 'security'],
    hints: ['Store the expiration timestamp alongside the value. Consider using setTimeout to actively delete keys, or passively delete them upon the next get/count call.'],
    createdAt: '2025-01-11T00:00:00Z'
  },
  {
    id: 'sliding-window-rate-limiter',
    title: '33. Sliding Window Rate Limiter',
    category: 'backend',
    difficulty: 'expert',
    language: 'javascript',
    estimatedMinutes: 60,
    prompt: `Design the core logic for a Sliding Window Log rate limiter to protect a backend API from DDoS attacks or abuse.\n\nImplement a \`RateLimiter\` class initialized with \`limit\` (max requests) and \`windowSize\` (time window in milliseconds).\nProvide a method \`isAllowed(userId, timestamp)\` that returns \`true\` if the request is allowed, or \`false\` if it exceeds the limit within the rolling window looking back from the given \`timestamp\`.\n\nUnlike fixed-window limiters, a sliding window must look at the exact continuous block of time preceding the current timestamp.`,
    constraints: [
      'Timestamps are always strictly increasing for a given user.',
      'The system must be memory efficient. Old timestamps falling outside the window should be discarded.'
    ],
    examples: [
      { input: 'limit=2, window=1000\nisAllowed("u1", 100)\nisAllowed("u1", 500)\nisAllowed("u1", 1000)\nisAllowed("u1", 1200)', output: 'true\ntrue\nfalse\ntrue', explanation: 'At t=1000, looking back to t=0, there are already 2 requests (100, 500), so it fails. At t=1200, looking back to t=200, the t=100 request is out of the window, leaving only t=500, so it passes.' }
    ],
    testCases: [
      { id: 'tc1', input: 'init:2:1000\nallow:userA:100\nallow:userA:500\nallow:userA:1000', expectedOutput: 'true\ntrue\nfalse', points: 40 },
      { id: 'tc2', input: 'init:2:1000\nallow:userA:100\nallow:userA:500\nallow:userB:900\nallow:userA:1200', expectedOutput: 'true\ntrue\ntrue\ntrue', points: 60 }
    ],
    optimalComplexity: { time: 'O(1) amortized per request (cleaning up old logs)', space: 'O(limit * U) where U is number of active users' },
    tags: ['architecture', 'queues', 'security', 'api-design'],
    evaluationFocus: ['efficiency', 'correctness', 'explanation'],
    hints: ['For each user, maintain a queue (or array) of timestamps. When a new request comes in, remove all timestamps older than (currentTimestamp - windowSize), then check the length of the queue.'],
    createdAt: '2025-01-12T00:00:00Z'
  },
  {
    id: 'valid-palindrome',
    title: '34. Valid Palindrome',
    category: 'algorithms',
    difficulty: 'easy',
    language: 'both',
    estimatedMinutes: 15,
    prompt: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' }],
    testCases: [
      { id: 'tc1', input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', points: 50 },
      { id: 'tc2', input: 'race a car', expectedOutput: 'false', points: 50 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['two-pointers', 'string'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Use two pointers, one at the start and one at the end, skipping non-alphanumeric characters.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'n-queens',
    title: '35. N-Queens',
    category: 'algorithms',
    difficulty: 'hard',
    language: 'both',
    estimatedMinutes: 45,
    prompt: `The n-queens puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other. Given an integer \`n\`, return all distinct solutions to the n-queens puzzle.`,
    constraints: ['1 <= n <= 9'],
    examples: [{ input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', explanation: 'There are two distinct solutions for the 4-queens puzzle.' }],
    testCases: [
      { id: 'tc1', input: '4', expectedOutput: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', points: 100 }
    ],
    optimalComplexity: { time: 'O(N!)', space: 'O(N^2)' },
    tags: ['backtracking', 'array'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Use backtracking. Keep track of occupied columns and diagonals using sets or arrays.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'max-subarray',
    title: '36. Maximum Subarray',
    category: 'algorithms',
    difficulty: 'easy',
    language: 'both',
    estimatedMinutes: 20,
    prompt: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' }],
    testCases: [
      { id: 'tc1', input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', points: 100 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['array', 'dynamic-programming'],
    evaluationFocus: ['efficiency'],
    hints: ["Kadane's Algorithm is your friend here."],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'merge-k-lists',
    title: '37. Merge k Sorted Lists',
    category: 'algorithms',
    difficulty: 'hard',
    language: 'both',
    estimatedMinutes: 40,
    prompt: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.`,
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500'],
    examples: [{ input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'The merged lists create a single sorted list.' }],
    testCases: [
      { id: 'tc1', input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', points: 100 }
    ],
    optimalComplexity: { time: 'O(N log k)', space: 'O(k)' },
    tags: ['linked-list', 'divide-and-conquer', 'heap'],
    evaluationFocus: ['efficiency', 'correctness'],
    hints: ['Consider using a priority queue (min-heap) or a divide and conquer approach.'],
    createdAt: '2025-01-15T00:00:00Z'
  },

  // CATEGORY: DATA STRUCTURES
  {
    id: 'reverse-linked-list',
    title: '38. Reverse Linked List',
    category: 'data-structures',
    difficulty: 'easy',
    language: 'both',
    estimatedMinutes: 15,
    prompt: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    constraints: ['The number of nodes in the list is the range [0, 5000].'],
    examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Standard list reversal.' }],
    testCases: [
      { id: 'tc1', input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', points: 100 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['linked-list'],
    evaluationFocus: ['correctness'],
    hints: ['Keep track of previous, current, and next pointers.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'lfu-cache',
    title: '39. Design LFU Cache',
    category: 'data-structures',
    difficulty: 'hard',
    language: 'both',
    estimatedMinutes: 50,
    prompt: `Design and implement a data structure for a Least Frequently Used (LFU) cache. Implement the \`LFUCache\` class with \`get(key)\` and \`put(key, value)\` methods in O(1) average time complexity.`,
    constraints: ['0 <= capacity <= 10^4'],
    examples: [{ input: 'LFUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)', output: 'null, null, null, 1, null, -1', explanation: 'Key 2 is evicted because its frequency is lower.' }],
    testCases: [
      { id: 'tc1', input: 'capacity:2\nput:1:1\nput:2:2\nget:1\nput:3:3\nget:2', expectedOutput: '1\n-1', points: 100 }
    ],
    optimalComplexity: { time: 'O(1)', space: 'O(n)' },
    tags: ['design', 'hash-map', 'linked-list'],
    evaluationFocus: ['efficiency', 'architecture'],
    hints: ['You will need multiple data structures: one for frequencies, one for keys, and a minimum frequency tracker.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'valid-anagram',
    title: '40. Valid Anagram',
    category: 'data-structures',
    difficulty: 'easy',
    language: 'both',
    estimatedMinutes: 10,
    prompt: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.`,
    constraints: ['1 <= s.length, t.length <= 5 * 10^4'],
    examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Both contain the exact same characters.' }],
    testCases: [
      { id: 'tc1', input: 'anagram\nnagaram', expectedOutput: 'true', points: 100 }
    ],
    optimalComplexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['hash-map', 'string'],
    evaluationFocus: ['efficiency'],
    hints: ['Count the frequencies of characters in both strings using an array of size 26.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'word-search-ii',
    title: '41. Word Search II',
    category: 'data-structures',
    difficulty: 'hard',
    language: 'both',
    estimatedMinutes: 50,
    prompt: `Given an \`m x n\` \`board\` of characters and a list of strings \`words\`, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells.`,
    constraints: ['1 <= board.length <= 12', '1 <= words.length <= 3 * 10^4'],
    examples: [{ input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]', explanation: 'Found inside the grid.' }],
    testCases: [
      { id: 'tc1', input: 'mock_grid\nmock_words', expectedOutput: '["eat","oath"]', points: 100 }
    ],
    optimalComplexity: { time: 'O(M*N*3^L)', space: 'O(W)' },
    tags: ['trie', 'backtracking'],
    evaluationFocus: ['efficiency', 'correctness'],
    hints: ['Combine a Trie (Prefix Tree) with DFS backtracking.'],
    createdAt: '2025-01-15T00:00:00Z'
  },

  // CATEGORY: FRONTEND
  {
    id: 'dom-selector',
    title: '42. Simple DOM Selector',
    category: 'frontend',
    difficulty: 'easy',
    language: 'javascript',
    estimatedMinutes: 20,
    prompt: `Write a function \`$(selector)\` that mimics jQuery. It should take a CSS selector string and return an array of matched DOM elements. If an ID selector is passed (e.g., "#myId"), return just that element.`,
    constraints: ['Do not use document.querySelectorAll.'],
    examples: [{ input: '$("#app")', output: '<div id="app"></div>', explanation: 'Returns a single element.' }],
    testCases: [
      { id: 'tc1', input: 'mock_dom', expectedOutput: 'element_match', points: 100 }
    ],
    optimalComplexity: { time: 'O(N)', space: 'O(N)' },
    tags: ['dom', 'javascript-fundamentals'],
    evaluationFocus: ['correctness', 'edge-cases'],
    hints: ['Check the first character of the string to decide between getElementById, getElementsByClassName, or getElementsByTagName.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'reactive-store',
    title: '43. Implement a Reactive Store',
    category: 'frontend',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 45,
    prompt: `Build a reactive state management system similar to Vue or MobX. Create a \`Store\` class where modifying a property automatically triggers subscribed callback functions.`,
    constraints: ['Must handle deep object reactivity.'],
    examples: [{ input: 'store.state.a = 2', output: 'Triggers callback attached to "a"', explanation: 'Reactivity in action.' }],
    testCases: [
      { id: 'tc1', input: 'mock_reactivity', expectedOutput: 'triggered', points: 100 }
    ],
    optimalComplexity: { time: 'O(1) update', space: 'O(N) for subscriptions' },
    tags: ['design-patterns', 'proxies'],
    evaluationFocus: ['architecture', 'correctness'],
    hints: ['Use Javascript ES6 Proxies.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'map-polyfill',
    title: '44. Array Map Polyfill',
    category: 'frontend',
    difficulty: 'easy',
    language: 'javascript',
    estimatedMinutes: 10,
    prompt: `Write a polyfill for \`Array.prototype.map\`. The function should iterate over the array, apply the callback, and return a new array.`,
    constraints: ['Do not use the native .map() method.'],
    examples: [{ input: '[1,2].myMap(x => x*2)', output: '[2,4]', explanation: 'Maps values properly.' }],
    testCases: [
      { id: 'tc1', input: '[1,2]\nx => x*2', expectedOutput: '[2,4]', points: 100 }
    ],
    optimalComplexity: { time: 'O(N)', space: 'O(N)' },
    tags: ['javascript-fundamentals', 'polyfills'],
    evaluationFocus: ['correctness'],
    hints: ['Ensure you pass the element, index, and array array context into the callback.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'dom-diffing',
    title: '45. Simple DOM Differ',
    category: 'frontend',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 60,
    prompt: `Write a function that accepts two virtual DOM trees (objects with type, props, and children) and returns an array of mutation instructions (e.g., ADD, REMOVE, REPLACE) to transform the first tree into the second.`,
    constraints: ['Assume a simplified vDOM structure.'],
    examples: [{ input: 'oldNode, newNode', output: '[{type: "REPLACE", target: oldNode, replacement: newNode}]', explanation: 'Outputs instructions.' }],
    testCases: [
      { id: 'tc1', input: 'mock_vdom', expectedOutput: 'mock_instructions', points: 100 }
    ],
    optimalComplexity: { time: 'O(N)', space: 'O(N)' },
    tags: ['algorithms', 'virtual-dom'],
    evaluationFocus: ['correctness', 'efficiency'],
    hints: ['Recursively compare types, then properties, then children.'],
    createdAt: '2025-01-15T00:00:00Z'
  },

  // CATEGORY: BACKEND
  {
    id: 'query-parser',
    title: '46. Query String Parser',
    category: 'backend',
    difficulty: 'easy',
    language: 'javascript',
    estimatedMinutes: 15,
    prompt: `Write a function that takes a URL query string (e.g., "?name=John&age=30&role=admin") and returns a JavaScript object representing the key-value pairs. Handle URI decoding.`,
    constraints: ['Do not use URLSearchParams.'],
    examples: [{ input: '"?name=John%20Doe&age=30"', output: '{ name: "John Doe", age: "30" }', explanation: 'Parses and decodes correctly.' }],
    testCases: [
      { id: 'tc1', input: '?name=John%20Doe&age=30', expectedOutput: '{"name":"John Doe","age":"30"}', points: 100 }
    ],
    optimalComplexity: { time: 'O(N)', space: 'O(N)' },
    tags: ['string-parsing'],
    evaluationFocus: ['correctness', 'edge-cases'],
    hints: ['Split by "&", then by "=".'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'distributed-lock',
    title: '47. Distributed Lock Simulator',
    category: 'backend',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 45,
    prompt: `Simulate a distributed lock system like Redis Redlock. Implement an \`acquireLock(resource, clientId, ttl)\` and \`releaseLock(resource, clientId)\` mechanism inside an asynchronous class. If a lock is held, other clients must be denied or put in a waiting queue.`,
    constraints: ['Locks must automatically expire after TTL.'],
    examples: [{ input: 'acquire("db", "c1", 1000); acquire("db", "c2", 1000);', output: 'c1 gets lock, c2 fails/waits.', explanation: 'Mutex logic.' }],
    testCases: [
      { id: 'tc1', input: 'mock_lock_race', expectedOutput: 'mutex_maintained', points: 100 }
    ],
    optimalComplexity: { time: 'O(1)', space: 'O(N) for locks' },
    tags: ['concurrency', 'system-design'],
    evaluationFocus: ['architecture', 'race-conditions'],
    hints: ['Track expiration times and owners in a Map.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'fetch-retry',
    title: '48. Fetch Wrapper with Retry',
    category: 'backend',
    difficulty: 'easy',
    language: 'javascript',
    estimatedMinutes: 20,
    prompt: `Write a wrapper around the native \`fetch\` API that takes a URL, options, and a \`retries\` count. If the request fails or returns a 5xx error, it should automatically retry up to \`retries\` times before finally rejecting.`,
    constraints: ['Must return a Promise.'],
    examples: [{ input: 'fetchWithRetry("/api/data", {}, 3)', output: 'Resolves after 2nd attempt.', explanation: 'First failed, second succeeded.' }],
    testCases: [
      { id: 'tc1', input: 'mock_fetch_fail', expectedOutput: 'success_on_retry', points: 100 }
    ],
    optimalComplexity: { time: 'O(R) where R is retries', space: 'O(1)' },
    tags: ['async', 'api'],
    evaluationFocus: ['correctness'],
    hints: ['Use recursion or a while loop with a try/catch block.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'consistent-hashing',
    title: '49. Consistent Hashing Ring',
    category: 'backend',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 50,
    prompt: `Implement a Consistent Hashing ring for a load balancer. Implement methods to \`addNode(nodeId)\`, \`removeNode(nodeId)\`, and \`getNode(key)\` to route requests. Ensure balanced distribution by implementing virtual nodes.`,
    constraints: ['Must handle adding/removing efficiently without rehashing everything.'],
    examples: [{ input: 'add("A"), add("B"), getNode("user1")', output: '"A"', explanation: 'Routes key to the nearest node on the ring.' }],
    testCases: [
      { id: 'tc1', input: 'mock_ring_operations', expectedOutput: 'consistent_routing', points: 100 }
    ],
    optimalComplexity: { time: 'O(log N) for routing', space: 'O(N)' },
    tags: ['architecture', 'hashing'],
    evaluationFocus: ['architecture', 'efficiency'],
    hints: ['Use a sorted array for the ring and binary search to find the nearest node.'],
    createdAt: '2025-01-15T00:00:00Z'
  },

  // CATEGORY: SYSTEM DESIGN
  {
    id: 'url-shortener-hash',
    title: '50. URL Shortener Base62',
    category: 'system-design',
    difficulty: 'easy',
    language: 'javascript',
    estimatedMinutes: 20,
    prompt: `Write a Base62 encoder/decoder for a URL Shortener. Given an integer ID from a database, convert it to a Base62 string (a-z, A-Z, 0-9), and vice versa.`,
    constraints: ['Must accurately convert large integers.'],
    examples: [{ input: 'encodeId(125)', output: '"cb"', explanation: '125 in Base62 represents "cb"' }],
    testCases: [
      { id: 'tc1', input: '125', expectedOutput: 'cb', points: 100 }
    ],
    optimalComplexity: { time: 'O(log N)', space: 'O(1)' },
    tags: ['math', 'architecture'],
    evaluationFocus: ['correctness'],
    hints: ['Use repeated division and modulo operations.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'realtime-leaderboard',
    title: '51. Real-time Leaderboard logic',
    category: 'system-design',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 50,
    prompt: `Design an in-memory data structure for a gaming leaderboard that supports \`addScore(playerId, score)\` and \`getTopK(k)\` in highly optimal time. Assume millions of players but frequent reads of the top K.`,
    constraints: ['getTopK must be significantly faster than sorting the entire list.'],
    examples: [{ input: 'add(1, 100), add(2, 200), getTopK(1)', output: '[{playerId: 2, score: 200}]', explanation: 'Retrieves top player.' }],
    testCases: [
      { id: 'tc1', input: 'mock_leaderboard', expectedOutput: 'top_k_list', points: 100 }
    ],
    optimalComplexity: { time: 'O(log N) add, O(K) get', space: 'O(N)' },
    tags: ['data-structures', 'heap', 'trees'],
    evaluationFocus: ['efficiency'],
    hints: ['Consider a balanced Binary Search Tree or maintaining a Min-Heap of size K.'],
    createdAt: '2025-01-15T00:00:00Z'
  },

  // CATEGORY: DEBUGGING
  {
    id: 'debug-map-filter',
    title: '52. Debug Map-Filter Chain',
    category: 'debugging',
    difficulty: 'easy',
    language: 'javascript',
    estimatedMinutes: 10,
    brokenCode: `const data = [{id: 1, val: 10}, {id: 2, val: 20}];\nconst result = data.filter(d => d.val > 15).map(d => d.value * 2);`,
    prompt: `The code is supposed to filter objects with a value over 15 and double them. Instead, it returns \`[NaN]\`. Fix the bug.`,
    constraints: ['Keep it as a map/filter chain.'],
    examples: [],
    testCases: [
      { id: 'tc1', input: 'conceptual', expectedOutput: '[40]', points: 100 }
    ],
    optimalComplexity: { time: 'O(N)', space: 'O(N)' },
    tags: ['javascript-fundamentals', 'debugging'],
    evaluationFocus: ['correctness'],
    hints: ['Look closely at the property names being accessed.'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'debug-event-bus',
    title: '53. Debug Event Bus Memory Leak',
    category: 'debugging',
    difficulty: 'hard',
    language: 'javascript',
    estimatedMinutes: 20,
    brokenCode: `class Bus {\n  constructor() { this.subs = []; }\n  on(cb) { this.subs.push(cb); }\n  emit(data) { this.subs.forEach(c => c(data)); }\n}\n// in component:\nbus.on(() => { console.log(this.state); });`,
    prompt: `Components subscribing to this global Event Bus are never garbage collected when destroyed. Implement an \`off\` method and demonstrate how to prevent the memory leak.`,
    constraints: ['Must allow specific callback removal.'],
    examples: [],
    testCases: [
      { id: 'tc1', input: 'conceptual', expectedOutput: 'unsubscribe_implemented', points: 100 }
    ],
    optimalComplexity: { time: 'O(N) removal', space: 'O(N)' },
    tags: ['architecture', 'memory-leak'],
    evaluationFocus: ['architecture', 'security'],
    hints: ['The `on` method should probably return an unsubscribe function, or you need an explicit `off(callback)` method.'],
    createdAt: '2025-01-15T00:00:00Z'
  }
];