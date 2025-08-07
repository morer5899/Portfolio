import 'framer-motion';

declare module 'framer-motion' {
  export interface HTMLMotionProps<TagName extends keyof React.JSX.IntrinsicElements>
    extends React.HTMLAttributes<TagName> {
    className?: string;
  }
}
