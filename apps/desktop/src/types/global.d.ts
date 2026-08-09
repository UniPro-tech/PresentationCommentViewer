export {};

declare global {
  interface Window {
    commentAPI: {
      onComment(callback: (text: string) => void): void;
    };
  }
}
