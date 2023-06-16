import {
  useOnDocument,
  useSignal,
  $,
  type QRL,
  implicit$FirstArg,
} from "@builder.io/qwik";

export function useMousePosQrl(
  fnQrl: QRL<(pos: { x: number; y: number }) => void>
) {
  const pos = useSignal({ x: 0, y: 0 });
  useOnDocument(
    "mousemove",
    $(async (e) => {
      const target = e as MouseEvent;
      pos.value = { x: target.clientX, y: target.clientY };
      await fnQrl(pos.value);
    })
  );

  return pos;
}

export const useMousePos$ = implicit$FirstArg(useMousePosQrl);
