import { Suspense } from "react";
import ModelCreatedClient from "./ModelCreatedClient";

export default function ModelCreated() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModelCreatedClient />
    </Suspense>
  );
}
