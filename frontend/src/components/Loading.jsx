/**
 * Loading bileşeni - Yükleme durumunda gösterilir
 */
function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
    </div>
  );
}

export default Loading;
