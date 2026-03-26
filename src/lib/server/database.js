// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
const db = new Map();

export function getTodos(userid) {
    if (!db.get(userid)) {
        db.set(userid, [{
            id: crypto.randomUUID(),
            description: 'Learn SvelteKit',
            done: false
        }]);
    }

    return db.get(userid);
}

export function createTodo(userid, description) {
    // error 1 - empty description text
    if (description === '') {
        throw new Error('todo must have a description');
    }

    // error 2 - description text contains < or >
    if (description.includes('<') || description.includes('>')) {
        throw new Error('description may NOT contain the HTML entities "<" or ">" ');
    }

    const todos = db.get(userid);

    // error 3 - text is identical to an existing TODO
    if (todos.find((todo) => todo.description === description)) {
        throw new Error('todos must be unique');
    }

    todos.push({
        id: crypto.randomUUID(),
        description,
        done: false
    });
}

export function deleteTodo(userid, todoid) {
    const todos = db.get(userid);
    const index = todos.findIndex((todo) => todo.id === todoid);

    if (index !== -1) {
        todos.splice(index, 1);
    }
}
