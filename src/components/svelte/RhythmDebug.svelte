<script lang="ts">
    import { onMount } from 'svelte';

    let active = $state(false);

    const toggle = () => {
        active = !active;

        if (typeof document !== 'undefined') {
            document.body.classList.toggle('debug-rhythm', active);
        }

        console.log(`Rhythm grid ${active ? 'enabled' : 'disabled'} (Ctrl+Shift+G)`);
    };

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyG') {
            event.preventDefault();
            toggle();
        }
    };

    onMount(() => {
        window.addEventListener('keydown', handleKeydown);

        // toggle();

        return () => {
            window.removeEventListener('keydown', handleKeydown);

            // Clean up the class when the component unmounts
            if (typeof document !== 'undefined') {
                document.body.classList.remove('debug-rhythm');
            }
        };
    });
</script>
