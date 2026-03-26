
[Stage 1](https://github.com/dr-matt-smith/FEDev-form-validation-with-user-error-messages---stage-1)
|
[Stage 2](https://github.com/dr-matt-smith/FEDev-form-validation-with-user-error-messages--stage-2)
|
[Stage 3](https://github.com/dr-matt-smith/FEDev-form-validation-with-user-error-messages-stage-3)
|
[Stage 4](https://github.com/dr-matt-smith/FEDev-form-validation-with-user-error-messages-stage-4)
|
Stage 5


# FEDev-form-validation-with-user-error-messages


# stage 5 - sticky form (don't make user have to re-type description when there was a problem with it)

A 'sticky' form remembers what was previously typed when it is redisplayed to the user with an error message.

## add a third form validaiton error condition in the database script

So far there are 2 form validation error conditions:
- description must not be empty
- description must not exactly match an existing TODO

Let's add a third:
- description must NOT contain contains "<" or ">"

Let's add this as another case where our `createTodo()` function in `/lib/server/database.js`:

```javascript
  export function createTodo(userid, description) {
    // error 1 - empty description text
    if (description === '') {
      throw new Error('todo must have a description');
    }

    // error 2 - description text contains < or >
    if (description.contains('<') || description.contains('>')) {
      throw new Error('description may NOT contain the HTML entities "<" or ">" ');
    }
  
    ... as before ...
```

So the full listing now looks as follows:

`/lib/server/database.js`

```javascript
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
```

## paste the `description` text into the form after an error

When the Svelte form page is redisplayed after the form processing action `fail()` function has sent data let's now paste the `description` text into the text input of the form, to save retyping by the user.

We can do this by populating the `value` attribute of the form text `<input>` element of our `/routes/+page.svelte` page script:

```javascript
    ...

    <input
        name="description"
        autocomplete="off"
        value={form?.description ?? ''}
    />

    ...
```

NOTE:
- `{form?.description ?? ''}` is a concise way of saying:
  - if `form` is not undefined AND has a `description` property, insert the `description` text here
  - OTHERWISE insert an empty string

Here we see screenshots of this 'sticky' form text in action when errors occur:

![stick form text with error messages](/screenshots/60_sticky_form_contents.png)

So the full listing is as follows:

`/routes/+page.svelte`

```javascript
<script>
    let { data, form } = $props();
</script>

<div class="centered">
    <h1>todos</h1>

    {#if form?.error}
        <p class="error">ERROR: {form.error}</p>
    {/if}

    <form method="POST" action="?/create">
        <label>
            add a todo:
            <input
                name="description"
                autocomplete="off"
                value={form?.description ?? ''}
            />
        </label>
    </form>
    
    <ul class="todos">
        {#each data.todos as todo (todo.id)}
            <li>
                <form method="POST" action="?/delete">
                    <input type="hidden" name="id" value={todo.id} />
                    <span>{todo.description}</span>
                    <button aria-label="Mark as complete"></button>
                </form>
            </li>
        {/each}
    </ul>
</div>

<style>
    .centered {
        max-width: 20em;
        margin: 0 auto;
    }

    label {
        width: 100%;
    }

    input {
        flex: 1;
    }

    span {
        flex: 1;
    }

    button {
        border: none;
        background: url(./remove.svg) no-repeat 50% 50%;
        background-size: 1rem 1rem;
        cursor: pointer;
        height: 100%;
        aspect-ratio: 1;
        opacity: 0.5;
        transition: opacity 0.2s;
    }

    button:hover {
        opacity: 1;
    }

    .error {
        padding: 1rem;
        background-color: lightpink;
    }
</style>
```