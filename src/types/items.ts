import { ComponentType } from "react";
import { Position } from "./grid";

export interface ItemType {
  width: number;
  height: number;
  color?: string;
  icon: ComponentType;
}

export interface Item extends Position {
  id: number;
  type: string;
  width: number;
  height: number;
  color?: string;
}

export type ToolType = 'shelf' | 'forklift';
