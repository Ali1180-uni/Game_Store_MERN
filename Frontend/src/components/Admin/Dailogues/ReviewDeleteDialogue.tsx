const ConfirmDeleteReviewDialog = ({
  reviewerName,
  onCancel,
  onConfirm,
  isDeleting,
}: {
  reviewerName: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
    <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center">
      <h3 className="text-lg font-semibold text-white">Delete this review?</h3>
      <p className="mt-2 text-sm text-neutral-400">
        This will permanently delete <span className="text-white">{reviewerName}</span>'s review. This
        can't be undone.
      </p>
      <div className="mt-6 flex gap-2.5">
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-neutral-700 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteReviewDialog;