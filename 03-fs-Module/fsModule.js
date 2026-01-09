/*

What is fs module?

The fs module allows Node.js to work with files and directories:

       i.Read files

       ii.Write files

       iii.Update files

       iv.Delete files

       v.Create folders

👉 It is a core module → no installation needed

       const fs = require('fs');


*/

//                Writefile vs WriteFileSyn

/*
fs.writeFile() vs fs.writeFileSync() (IN DEPTH)

First, import fs:

const fs = require('fs');

1️⃣ fs.writeFile() — Asynchronous (Non-Blocking)
🔹 Definition

Writes data to a file without blocking the Node.js event loop.

👉 If the file does not exist → created
👉 If the file exists → overwritten

🔹 Syntax :
fs.writeFile(path, data, options, callback);

Parameters:

Parameter	                Meaning
path	                   File path
data	                   Content to write
options	                 encoding, flag, mode (optional)
callback	               Runs after write completes

🔹 Basic Example :

fs.writeFile('file.txt', 'Hello Node', (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('File written successfully');
});

console.log('This runs first');

Output order 🧠
This runs first
File written successfully


✔ Shows non-blocking behavior

🔹 What happens internally?

Request sent to OS

Node continues executing code

OS finishes writing

Callback pushed to event loop

Callback executes

🔹 Overwriting behavior
fs.writeFile('file.txt', 'New Content', callback);


⚠ Old content is erased

🔹 Writing JSON data
const data = { name: 'Alex', age: 20 };

fs.writeFile('user.json', JSON.stringify(data), err => {
  if (err) throw err;
});

🔹 Options object
fs.writeFile(
  'file.txt',
  'Hello',
  { encoding: 'utf8', flag: 'w' },
  callback
);

Flag	            Meaning
w	                write (default)
a	                append
wx	               fail if file exists
🔹 Real-world usage

✔ Express servers
✔ APIs
✔ Production apps
✔ High-performance systems

2️⃣ fs.writeFileSync() — Synchronous (Blocking)
🔹 Definition

Writes data to a file and blocks execution until complete.

🔹 Syntax
fs.writeFileSync(path, data, options);


(No callback)

🔹 Example
fs.writeFileSync('file.txt', 'Hello Sync');
console.log('This runs after file write');

Execution 🧠
(File write completes)
This runs after file write


✔ Code waits
❌ Event loop blocked

🔹 Error handling (IMPORTANT)
try {
  fs.writeFileSync('file.txt', 'Hello');
} catch (err) {
  console.error(err);
}

🔹 When to use?

✔ Scripts
✔ CLI tools
✔ Startup config files
✔ Competitive programming

❌ Never inside servers / APIs

3️⃣ Side-by-Side Comparison (EXAM GOLD 🥇)
Feature	            writeFile	         writeFileSync

Type	               Async	             Sync
Blocking	           ❌ No	             ✔ Yes
Callback	           ✔ Yes	            ❌ No
Speed	               Fast	               Slower
Event loop	         Free	               Blocked
Production	         ✔ Yes	            ❌ No
Error handling	     Callback	           try-catch



4️⃣ Event Loop Impact (VERY IMPORTANT)
❌ Bad Practice
app.get('/', (req, res) => {
  fs.writeFileSync('log.txt', 'User visited');
  res.send('Done');
});


👉 Blocks all users until write completes

✔ Correct Practice
app.get('/', (req, res) => {
  fs.writeFile('log.txt', 'User visited', () => {});
  res.send('Done');
});

5️⃣ Modern Way: fs/promises (BEST PRACTICE)
const fs = require('fs/promises');

async function writeFile() {
  await fs.writeFile('file.txt', 'Hello Promises');
  console.log('Done');
}

writeFile();


✔ Async
✔ Clean
✔ Interview-friendly

6️⃣ Common Mistakes 🚫

❌ Using sync method in backend
❌ Forgetting overwrite behavior
❌ Not handling errors
❌ Blocking event loop unknowingly

7️⃣ One-line Interview Answer 🎯

fs.writeFile() writes data asynchronously without blocking the event loop, while fs.writeFileSync() blocks execution until the file write is complete.
*/




//                         readFile vs readFileSync


/*
fs.readFile() vs fs.readFileSync() (IN DEPTH)

First, import:

const fs = require('fs');

1️⃣ fs.readFile() — Asynchronous (Non-Blocking)
🔹 Definition

Reads the contents of a file without blocking the Node.js event loop.

🔹 Syntax
fs.readFile(path, options, callback);

Parameters
Parameter                      	Meaning
path	                         File path
options	                       encoding or object
callback	                     (err, data)

🔹 Basic Example
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

console.log('This runs first');

Output order 🧠
This runs first
<file contents>


✔ Shows non-blocking behavior

🔹 What if encoding is NOT given?
fs.readFile('file.txt', (err, data) => {
  console.log(data);
});


Output:

<Buffer 48 65 6c 6c 6f>


👉 Node returns a Buffer, not a string.

✔ Correct:

fs.readFile('file.txt', 'utf8', callback);

🔹 Reading JSON files
fs.readFile('user.json', 'utf8', (err, data) => {
  const user = JSON.parse(data);
  console.log(user.name);
});

🔹 Error handling
fs.readFile('missing.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('File not found');
    return;
  }
});

🔹 Internal working (IMPORTANT)

Request sent to OS

Node continues execution

File read completes

Callback enters event queue

Callback executed by event loop

🔹 When to use?

✔ Express servers
✔ APIs
✔ Reading configs
✔ Handling user requests

2️⃣ fs.readFileSync() — Synchronous (Blocking)
🔹 Definition

Reads file content and blocks execution until completed.

🔹 Syntax
const data = fs.readFileSync(path, options);

🔹 Example
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);
console.log('This runs after reading');

Execution 🧠
(file read completes)
file content
This runs after reading


❌ Event loop blocked

🔹 Error handling (VERY IMPORTANT)
try {
  const data = fs.readFileSync('file.txt', 'utf8');
} catch (err) {
  console.error(err);
}

🔹 When to use?

✔ Scripts
✔ CLI tools
✔ Startup configuration
✔ Competitive programming

❌ Never inside web servers

3️⃣ Side-by-Side Comparison (EXAM GOLD 🥇)
Feature	         readFile	        readFileSync
Type	            Async	             Sync
Blocking	        ❌ No	            ✔ Yes
Callback	         ✔ Yes	           ❌ No
Return value	     ❌	              ✔
Event loop	       Free	             Blocked
Server use	       ✔ Yes	          ❌ No


4️⃣ Real Server Example (VERY IMPORTANT)
❌ Wrong
app.get('/', (req, res) => {
  const data = fs.readFileSync('data.txt', 'utf8');
  res.send(data);
});


👉 Blocks all users

✔ Correct
app.get('/', (req, res) => {
  fs.readFile('data.txt', 'utf8', (err, data) => {
    res.send(data);
  });
});

5️⃣ Using fs/promises (BEST PRACTICE)
const fs = require('fs/promises');

async function readFile() {
  const data = await fs.readFile('file.txt', 'utf8');
  console.log(data);
}

readFile();


✔ Async
✔ Clean
✔ Modern
✔ Interview-ready

6️⃣ Common Mistakes 🚫

❌ Forgetting encoding
❌ Blocking server with sync methods
❌ Not handling errors
❌ Assuming readFile returns data

7️⃣ One-line Interview Answer 🎯

fs.readFile() reads files asynchronously without blocking the event loop, while fs.readFileSync() blocks execution until the file is fully read.

*/