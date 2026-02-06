<script lang="ts">
    import { createLogger } from '@utils/logger';
    import { onMount } from 'svelte';

    const logger = createLogger({ prefix: 'RhythmDebug' });

    let active = $state(false);

    const toggle = () => {
        active = !active;

        if (typeof document !== 'undefined') {
            document.body.classList.toggle('debug-rhythm', active);
        }

        logger.info(`Rhythm grid ${active ? 'enabled' : 'disabled'} (Ctrl+Shift+G)`);
    };

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyG') {
            event.preventDefault();
            toggle();
        }
    };

    onMount(() => {
        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);

            // Clean up the class when the component unmounts
            if (typeof document !== 'undefined') {
                document.body.classList.remove('debug-rhythm');
            }
        };
    });
</script>
