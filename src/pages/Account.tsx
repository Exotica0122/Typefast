import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../utils/supabaseClient";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const Account = () => {
  const session = useAuthStore((state) => state.session);
  const updateSession = useAuthStore((state) => state.updateSession);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState({ left: 0, right: 9 });
  const [typingHistories, setTypingHistories] = useState<TypingHistory[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      let sessionResult = session;
      if (!sessionResult) {
        const supabaseSession = await supabase.auth.getSession();

        // when no fallback session found
        if (!supabaseSession.data.session) {
          setIsLoading(false);
          return;
        }

        updateSession(supabaseSession.data.session);
        sessionResult = supabaseSession.data.session;
      }

      const { data: typingHistoryData, error } = await supabase
        .from("typing_history")
        .select("*")
        .eq("userId", sessionResult.user.id)
        .order("date", { ascending: false });

      if (error) return toast.error(error.message);

      setTypingHistories(typingHistoryData);
      setIsLoading(false);
    };

    fetchHistory();
  }, []);

  if (!session) {
    return <h1>Not signed in!</h1>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="text-xs uppercase text-neutral-500">
          <tr>
            <th scope="col" className="px-6 py-3">
              wpm
            </th>
            <th scope="col" className="px-6 py-3">
              accuracy
            </th>
            <th scope="col" className="px-6 py-3">
              mode
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              date
            </th>
          </tr>
        </thead>
        <tbody>
          {typingHistories.map(({ id, wpm, accuracy, mode, date }, i) => {
            return (
              <tr key={id} className="text-white">
                <th
                  scope="row"
                  className={`whitespace-nowrap px-6 py-4 ${i % 2 == 0 ? "rounded-l-lg bg-neutral-900" : ""}`}
                >
                  {wpm}
                </th>
                <td
                  className={`px-6 py-4 ${i % 2 == 0 ? "bg-neutral-900" : ""}`}
                >
                  {accuracy}
                </td>
                <td
                  className={`px-6 py-4 ${i % 2 == 0 ? "bg-neutral-900" : ""}`}
                >
                  {mode}
                </td>
                <td
                  className={`px-6 py-4 ${i % 2 == 0 ? "rounded-r-lg bg-neutral-900" : ""}`}
                >
                  {new Date(date).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
