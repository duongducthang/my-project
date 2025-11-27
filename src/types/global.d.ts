declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg' {
  const src: string;
  export default src;
}
