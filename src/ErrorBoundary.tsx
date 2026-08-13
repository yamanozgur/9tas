import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#FAF6F0] text-[#2C1810] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-[#FFFDF9] border-2 border-[#7A4219] rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-black text-[#7A4219] mb-2 font-serif">9 Taş Oyunu</h2>
            <p className="text-sm text-[#5C3210] mb-4">Bir yükleme sorunu oluştu.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-3 rounded-xl bg-[#7A4219] text-[#FFF8E7] font-bold text-sm hover:bg-[#8B5A2B] transition-colors cursor-pointer shadow-md"
            >
              Yeniden Yükle
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
