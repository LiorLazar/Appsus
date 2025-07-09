/**
 * Note Animation Service
 * Handles all masonry layout and animation logic
 */

export const NoteAnimate = {
    /**
     * Initialize masonry layout for a container
     * @param {HTMLElement} container - The container element
     * @param {Object} options - Configuration options
     */
    initMasonry(container, options = {}) {
        if (!container) return

        const {
            delay = 100,
            gap = 16, // Increased gap from 12 to 16
            cardWidth = 239,
            paddingOffset = 32
        } = options

        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.arrangeMasonry(container, { gap, cardWidth, paddingOffset })
        }, delay)
    },

    /**
     * Arrange notes in masonry layout
     * @param {HTMLElement} container - The container element  
     * @param {Object} options - Configuration options
     */
    arrangeMasonry(container, options = {}) {
        if (!container) return

        const {
            gap = 16, // Increased gap from 12 to 16
            cardWidth = 239,
            paddingOffset = 32,
            fastTransition = false
        } = options

        const cards = container.querySelectorAll('.note-item')
        const containerWidth = container.offsetWidth // Use full width since no padding
        const cols = Math.floor(containerWidth / (cardWidth + gap))
        
        if (cols === 0) return

        // Calculate total width needed for all columns
        const totalContentWidth = (cols * cardWidth) + ((cols - 1) * gap)
        
        // Calculate offset to center the content with equal gaps on both sides
        const availableSpace = containerWidth - totalContentWidth
        const centerOffset = Math.floor(availableSpace / 2)
        
        // Ensure we don't have negative positioning
        const finalOffset = Math.max(0, centerOffset)

        const colHeights = new Array(cols).fill(0)
        
        cards.forEach((card, index) => {
            // Apply fast transition class if needed
            if (fastTransition) {
                card.classList.add('fast-transition')
                // Remove it after transition
                setTimeout(() => {
                    card.classList.remove('fast-transition')
                }, 250)
            }
            
            const minColIndex = colHeights.indexOf(Math.min(...colHeights))
            const x = finalOffset + (minColIndex * (cardWidth + gap))
            const y = colHeights[minColIndex]
            
            card.style.position = 'absolute'
            card.style.left = `${x}px`
            card.style.top = `${y}px`
            card.style.width = `${cardWidth}px`
            
            // Update column height
            const cardHeight = card.offsetHeight
            colHeights[minColIndex] += cardHeight + gap
        })
        
        // Set container height
        container.style.height = `${Math.max(...colHeights)}px`
        container.style.position = 'relative'
    },

    /**
     * Handle window resize events with debouncing
     * @param {HTMLElement} container - The container element
     * @param {Object} options - Configuration options
     */
    handleResize(container, options = {}) {
        const { debounceDelay = 50, immediateResponse = true } = options
        
        // For immediate visual feedback, trigger layout immediately
        if (immediateResponse) {
            this.arrangeMasonry(container, { ...options, fastTransition: true })
        }
        
        // Debounce for final smooth positioning
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout)
        }

        this.resizeTimeout = setTimeout(() => {
            this.arrangeMasonry(container, { ...options, fastTransition: false })
        }, debounceDelay)
    },

    /**
     * Handle image load events
     * @param {HTMLElement} container - The container element
     * @param {Object} options - Configuration options
     */
    handleImageLoad(container, options = {}) {
        const { delay = 50 } = options
        
        // Small delay to ensure image is rendered
        setTimeout(() => {
            this.arrangeMasonry(container, options)
        }, delay)
    },

    /**
     * Setup resize listener for a container
     * @param {HTMLElement} container - The container element
     * @param {Object} options - Configuration options
     * @returns {Function} Cleanup function
     */
    setupResizeListener(container, options = {}) {
        const handleResize = () => this.handleResize(container, options)
        
        window.addEventListener('resize', handleResize)
        
        // Return cleanup function
        return () => {
            window.removeEventListener('resize', handleResize)
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout)
            }
        }
    },

    /**
     * Add image load listeners to all images in container
     * @param {HTMLElement} container - The container element
     * @param {Object} options - Configuration options
     * @returns {Function} Cleanup function
     */
    setupImageListeners(container, options = {}) {
        if (!container) return () => {}

        const images = container.querySelectorAll('.note-img')
        const listeners = []

        images.forEach(img => {
            const onLoad = () => this.handleImageLoad(container, options)
            const onError = () => this.handleImageLoad(container, options)

            img.addEventListener('load', onLoad)
            img.addEventListener('error', onError)

            // Store for cleanup
            listeners.push(() => {
                img.removeEventListener('load', onLoad)
                img.removeEventListener('error', onError)
            })
        })

        // Return cleanup function
        return () => {
            listeners.forEach(cleanup => cleanup())
        }
    }
}
