import React, { ErrorInfo } from 'react';
import { Notification, KIND } from 'baseui/notification';

type Props = {
  children: React.ReactNode,
};

type State = {
  hasError: boolean,
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service.
    // eslint-disable-next-line no-console
    console.error(error, errorInfo);
    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <Notification
          kind={KIND.negative}
          overrides={{
            Body: {style: {width: 'auto'}},
          }}
        >
          Component has crashed
        </Notification>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
