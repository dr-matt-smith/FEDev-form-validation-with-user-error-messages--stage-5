<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="http://localhost:5173/images/favicon.svg" />
	<link rel="icon" href={favicon} />

</svelte:head>

{@render children()}
