import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("str_replace_editor create shows Creating filename", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/App.jsx" }} state="call" />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("str_replace_editor str_replace shows Editing filename", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "str_replace", path: "/src/Card.jsx" }} state="call" />);
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("str_replace_editor insert shows Editing filename", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "insert", path: "/src/Card.jsx" }} state="call" />);
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("str_replace_editor view shows Reading filename", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "view", path: "/src/index.tsx" }} state="call" />);
  expect(screen.getByText("Reading index.tsx")).toBeDefined();
});

test("str_replace_editor undo_edit shows Undoing edit on filename", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "undo_edit", path: "/src/utils.ts" }} state="call" />);
  expect(screen.getByText("Undoing edit on utils.ts")).toBeDefined();
});

test("str_replace_editor unknown command shows Working on filename", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "other", path: "/src/foo.tsx" }} state="call" />);
  expect(screen.getByText("Working on foo.tsx")).toBeDefined();
});

test("file_manager delete shows Deleting filename", () => {
  render(<ToolInvocationBadge toolName="file_manager" args={{ command: "delete", path: "/src/old.jsx" }} state="call" />);
  expect(screen.getByText("Deleting old.jsx")).toBeDefined();
});

test("file_manager rename shows Renaming filename", () => {
  render(<ToolInvocationBadge toolName="file_manager" args={{ command: "rename", path: "/src/old.jsx", new_path: "/src/new.jsx" }} state="call" />);
  expect(screen.getByText("Renaming old.jsx")).toBeDefined();
});

test("unknown tool shows raw tool name", () => {
  render(<ToolInvocationBadge toolName="some_other_tool" args={{}} state="call" />);
  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("done state shows green dot and no spinner", () => {
  const { container } = render(
    <ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/App.jsx" }} state="result" result={{ success: true }} />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("in-progress state shows spinner and no green dot", () => {
  const { container } = render(
    <ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/App.jsx" }} state="call" />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
