import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

// Mock timers
jest.useFakeTimers();

describe('useDebounce Hook', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });

    // Should still be initial value immediately
    expect(result.current).toBe('initial');

    // Fast forward time but not enough
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should still be initial value
    expect(result.current).toBe('initial');

    // Fast forward remaining time
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should now be updated value
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Change value multiple times rapidly
    rerender({ value: 'first', delay: 500 });
    
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'second', delay: 500 });
    
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'third', delay: 500 });

    // Should still be initial value
    expect(result.current).toBe('initial');

    // Fast forward full delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should be the latest value
    expect(result.current).toBe('third');
  });

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Change value and delay
    rerender({ value: 'updated', delay: 1000 });

    // Fast forward original delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should still be initial value because delay increased
    expect(result.current).toBe('initial');

    // Fast forward remaining time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should now be updated value
    expect(result.current).toBe('updated');
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 },
      }
    );

    // Change value with zero delay
    rerender({ value: 'updated', delay: 0 });

    // Should update immediately
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toBe('updated');
  });

  it('should work with different data types', () => {
    // Test with number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 1, delay: 500 },
      }
    );

    numberRerender({ value: 2, delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(numberResult.current).toBe(2);

    // Test with object
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: { key: 'initial' }, delay: 500 },
      }
    );

    objectRerender({ value: { key: 'updated' }, delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(objectResult.current).toEqual({ key: 'updated' });
  });

  it('should clean up timer on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Change value
    rerender({ value: 'updated', delay: 500 });

    // Unmount before timer fires
    unmount();

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // No errors should occur and timer should be cleaned up
    expect(jest.getTimerCount()).toBe(0);
  });

  it('should handle realistic search scenario', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: '', delay: 800 },
      }
    );

    // Simulate user typing "avengers"
    rerender({ value: 'a', delay: 800 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'av', delay: 800 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'ave', delay: 800 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'aven', delay: 800 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'aveng', delay: 800 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'avenge', delay: 800 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'avenger', delay: 800 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'avengers', delay: 800 });

    // Should still be empty string
    expect(result.current).toBe('');

    // Fast forward full delay
    act(() => {
      jest.advanceTimersByTime(800);
    });

    // Should be the final typed value
    expect(result.current).toBe('avengers');
  });
}); 