"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import LiquidityList from "./_components/LiquidityList";
import Link from "next/link";

export default function Pool() {

  return (
    <div className="w-4/5 mx-auto">
      <div>
        <Link href="/pool/create">
          <button className="btn btn-neutral btn-sm">+ Create Liquidity</button>
        </Link>
      </div>
      <div>
        <span>pools</span>
        <LiquidityList />
      </div>
    </div>
  );
}
