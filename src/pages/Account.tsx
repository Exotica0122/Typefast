import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../utils/supabaseClient";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";

const PAGINATE_VALUE = 10;

export const Account = () => {
  const session = useAuthStore((state) => state.session);
  const updateSession = useAuthStore((state) => state.updateSession);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState({ left: 0, right: 5 });
  const [typingHistories, setTypingHistories] = useState<TypingHistory[]>([]);

  const { averageWpm, wpmMax, averageAcc, accMax } = useMemo(() => {
    const { wpmTotal, accTotal, wpmMax, accMax } = typingHistories.reduce(
      (prevValue, currValue) => {
        if (!currValue.wpm || !currValue.accuracy) return prevValue;

        return {
          ...prevValue,
          wpmTotal: prevValue.wpmTotal + currValue.wpm,
          wpmMax: Math.max(prevValue.wpmMax, currValue.wpm),
          accTotal: prevValue.accTotal + currValue.accuracy,
          accMax: Math.max(prevValue.accMax, currValue.accuracy),
        };
      },
      {
        wpmTotal: 0,
        wpmMax: 0,
        accTotal: 0,
        accMax: 0,
      },
    );

    return {
      averageWpm: Math.floor(wpmTotal / typingHistories.length),
      averageAcc: Math.floor(accTotal / typingHistories.length),
      wpmMax,
      accMax,
    };
  }, [typingHistories]);

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

      if (typingHistoryData.length < PAGINATE_VALUE) {
        setPage((prevPage) => ({
          left: prevPage.left,
          right: typingHistoryData.length,
        }));
      }

      setTypingHistories(typingHistoryData);
      setIsLoading(false);
    };

    fetchHistory();
  }, []);

  const paginate = async () => {
    const newPage =
      page.right + PAGINATE_VALUE > typingHistories.length
        ? typingHistories.length
        : page.right + PAGINATE_VALUE;

    setPage((prevPage) => ({
      left: prevPage.left,
      right: newPage,
    }));
  };

  if (!session) {
    return <h1>Not signed in!</h1>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="mb-12 grid grid-cols-2 grid-rows-2">
        <Label title="average wpm:" value={averageWpm} />
        <Label title="highest wpm:" value={wpmMax} />
        <Label title="average acc:" value={`${averageAcc}%`} />
        <Label title="highest acc:" value={`${accMax}%`} />
      </div>
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
            if (i > page.right) return;

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
      {page.right < typingHistories.length && (
        <Button className="mt-8 w-full" onClick={paginate}>
          load more
        </Button>
      )}
    </div>
  );
};
