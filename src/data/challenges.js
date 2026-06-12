export const challenges = [
  // ==========================================
  // CATEGORY: ALGORITHMS (8 Challenges)
  // ==========================================
  {
    id: 'two-sum',
    title: '1. Two Sum',
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
    title: '2. Valid Parentheses',
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
    title: '3. Longest Substring Without Repeating Characters',
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
    title: '4. Merge Intervals',
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
    title: '5. Number of Islands',
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
    title: '6. LRU Cache',
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
    title: '7. Word Ladder',
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
    title: '8. Median of Two Sorted Arrays',
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

  // ==========================================
  // CATEGORY: DATA STRUCTURES (5 Challenges)
  // ==========================================
  {
    id: 'stack-using-queues',
    title: '9. Implement a Stack Using Two Queues',
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

  // ==========================================
  // CATEGORY: FRONTEND-SPECIFIC (7 Challenges)
  // ==========================================
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

  // ==========================================
  // CATEGORY: DEBUGGING (5 Challenges)
  // ==========================================
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

  // ==========================================
  // CATEGORY: SYSTEM DESIGN (IN CODE) (5 Challenges)
  // ==========================================
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
  }
];