function node(data, leftNode = null, rightNode = null) {
  return { data, leftNode, rightNode };
}

function tree(array) {
  let root = buildTree(array, 0, array.length - 1);
  return { array, root };
}

function sortAndRemoveDupes(array) {
  const sorted = [...new Set(array)].sort((a, b) => a - b);
  return sorted;
}

function buildTree(array, start, end) {
  let sorted = sortAndRemoveDupes(array);
  if (start > end) {
    return null;
  } else {
    let mid = parseInt((start + end) / 2);
    let root = node(sorted[mid]);
    root.leftNode = buildTree(sorted, start, mid - 1);
    root.rightNode = buildTree(sorted, mid + 1, end);
    return root;
  }
}

function insert(currentNode, key) {
  // If the tree is empty, return a new node
  if (currentNode == null) {
    currentNode = node(key);
    return currentNode;
  }

  if (key < currentNode.data) {
    currentNode.leftNode = insert(currentNode.leftNode, key);
  } else {
    currentNode.rightNode = insert(currentNode.rightNode, key);
  }
  return currentNode;
}

function deleteNode(treeRoot, k) {
  //Base case
  if (treeRoot === null) {
    return treeRoot;
  }

  if (treeRoot.data > k) {
    treeRoot.leftNode = deleteNode(treeRoot.leftNode, k);
    return treeRoot;
  } else if (treeRoot.data < k) {
    treeRoot.rightNode = deleteNode(treeRoot.rightNode, k);
    return treeRoot;
  }

  //Reach the node to be deleted

  //If the node only has one children or no children
  if (treeRoot.leftNode === null) {
    let temp = treeRoot.rightNode;
    delete treeRoot;
    return temp;
  } else if (treeRoot.rightNode === null) {
    let temp = treeRoot.leftNode;
    delete treeRoot;
    return temp;
  }

  //If both children exist
  else {
    let succParent = treeRoot;

    //Find successor
    let succ = treeRoot.rightNode;
    while (succ.leftNode !== null) {
      succParent = succ;
      succ = succ.leftNode;
    }

    if (succParent !== treeRoot) {
      succParent.leftNode = succ.rightNode;
    } else {
      succParent.rightNode = succ.rightNode;
    }

    //Copy sucessor data to root
    treeRoot.data = succ.data;

    //Delete successor and return root
    delete succ;
    return treeRoot;
  }
}

function find(value, root) {
  const node = root;
  if (node === null) return null;

  if (node.data !== value) {
    if (node.data < value) {
      return find(value, node.rightNode);
    } else {
      return find(value, node.leftNode);
    }
  }

  return node;
}

function levelOrder(root, callback) {
  const queue = [root];
  if (root === null) return;
  const results = [];

  while (queue[0]) {
    let level = [];
    let size = queue.length;
    for (let i = 0; i < size; i++) {
      let current = queue.shift();
      level.push(current.data);
      if (current.leftNode != null) queue.push(current.leftNode);
      if (current.rightNode != null) queue.push(current.rightNode);
      if (callback) callback(current);
    }
    results.push(level);
  }

  if (!callback) return results;
}

// root left right
function preOrder(root, callback, result = []) {
  if (root === null) return result;

  callback ? callback(root) : result.push(root.data);

  preOrder(root.leftNode, callback, result);
  preOrder(root.rightNode, callback, result);

  return result;
}

// left right root
function postOrder(root, callback, result = []) {
  if (root === null) return result;

  postOrder(root.leftNode, callback, result);
  postOrder(root.rightNode, callback, result);
  callback ? callback(root) : result.push(root.data);

  return result;
}

// left root right
function inOrder(root, callback, result = []) {
  if (root === null) return;

  inOrder(root.leftNode, callback, result);
  callback ? callback(root) : result.push(root.data);
  inOrder(root.rightNode, callback, result);

  return result;
}

/**
 * Height is defined as the number of edges in longest path from a given node to a leaf node.
 * Height of a leaf node is 0
 */
function height(root) {
  const node = root;
  if (node === null) return -1;
  const leftHeight = height(node.leftNode);
  const rightHeight = height(node.rightNode);
  return Math.max(leftHeight, rightHeight) + 1;
}

/**
 * Depth of a node is the number of edges from the node to the tree's root node.
 * Depth of root node is 0
 */
function depth(value, root, currentDepth = 0) {
  if (root === null) return 0;
  if (root.data === value) return currentDepth;

  const leftDepth = depth(value, root.leftNode, currentDepth + 1);
  if (leftDepth != 0) return leftDepth;

  const rightDepth = depth(value, root.rightNode, currentDepth + 1);
  if (rightDepth != 0) return rightDepth;

  return 0;
}

function isBalanced(root) {
  if (root === null) return true;
  const leftHeight = height(root.leftNode);
  const rightHeight = height(root.rightNode);
  if (Math.abs(leftHeight - rightHeight) > 1) return false;
  return isBalanced(root.leftNode) && isBalanced(root.rightNode);
}

function rebalance(root) {
  if (root === null) return;
  let sortedArray = inOrder(root);
  return tree(sortedArray).root;
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.rightNode !== null) {
    prettyPrint(node.rightNode, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.leftNode !== null) {
    prettyPrint(node.leftNode, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

let unbalancedTree = insert(tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root, 40); // create unbalanced binary search tree using insert function
console.log(tree([1, 2, 3, 4, 5, 6, 7, 8, 9])); // log a balanced binary search tree
prettyPrint(tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root); // print a balanced binary search tree
console.log(deleteNode(tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root, 2)); // delete a node
console.log(find(3, tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root)); // find a node
console.log(levelOrder(tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root)); // [5], [2, 7], [1, 3, 6, 8], [4, 9]
console.log(preOrder(tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root)); // [5, 2, 1, 3, 4, 7, 6, 8, 9]
console.log(postOrder(tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root)); // [1, 4, 3, 2, 6, 9, 8, 7, 5]
console.log(inOrder(tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(height(find(3, tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root))); // height = 1
console.log(depth(9, tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root)); // depth = 3
console.log(isBalanced(tree([1, 2, 3, 4, 5, 6, 7, 8, 9]).root)); // true
console.log(isBalanced(unbalancedTree)); // false

let balancedTree = rebalance(unbalancedTree); // rebalance the unbalanced tree and save it into a variable
console.log(isBalanced(balancedTree)); // check if the rebalanced tree is balanced - returns true
prettyPrint(balancedTree); // print rebalanced tree

// driver script

function randomNumbers(size) {
  let array = [];

  for (let i = 0; i < size; i++) {
    let number = Math.floor(Math.random() * 100);
    array.push(number);
  }
  return array;
}

let newTree = tree(randomNumbers(8)).root; // create a tree with random  numbers from 0 to 100
console.log(isBalanced(newTree)); // check if the tree is balanced - returns true in this case
console.log(levelOrder(newTree)); // logs them in level order
console.log(preOrder(newTree));
console.log(postOrder(newTree));
console.log(inOrder(newTree));

// add 3 random numbers > 100 to unbalance the tree
for (let i = 0; i < 3; i++) {
  insert(newTree, Math.floor(Math.random() * (999 - 100) + 100));
}

console.log(isBalanced(newTree)); // returns false
let rebalancedTree = rebalance(newTree); // balance the tree
prettyPrint(rebalancedTree);
console.log(isBalanced(rebalancedTree)); // returns true
console.log(levelOrder(rebalancedTree));
console.log(preOrder(rebalancedTree));
console.log(postOrder(rebalancedTree));
console.log(inOrder(rebalancedTree));
