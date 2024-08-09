export interface InputElement {
    html: HTMLDivElement,
    input: HTMLInputElement|HTMLTextAreaElement,
    setError: (str?: string) => void,
    setInput: (str?: string) => void,
    clearError: () => void
    validation: () => void
}