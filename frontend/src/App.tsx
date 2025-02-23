import * as React from "react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

function App() {
  const [totalSepnt, setTotalSpent] = useState(0);

  React.useEffect(() => {
    async function fetchTotalSpent() {
      const res = await fetch("/api/expenses/total-spent");
      const data = await res.json();
      setTotalSpent(data.total);
    }
    fetchTotalSpent();
  }, []);

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total ammount you've spent</CardDescription>
      </CardHeader>
      <CardContent>{totalSepnt}</CardContent>
    </Card>
  );
}

export default App;
