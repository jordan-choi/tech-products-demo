import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Tag from "./";

describe("Tag", () => {
	it("renders with correct text and default color", () => {
		const name = "Tag Name";
		render(<Tag>{name}</Tag>);

		const tagElement = screen.getByRole("checkbox", { name });
		expect(tagElement).toBeInTheDocument();
		expect(tagElement).toHaveClass("tag-blue");
	});

	it("renders with specified color", () => {
		const name = "Tag Name";
		render(<Tag color="green">{name}</Tag>);

		const tagElement = screen.getByRole("checkbox", { name });
		expect(tagElement).toHaveClass("tag-green");
	});

	it("toggles selected state on click", async () => {
		const name = "Tag Name";
		const user = userEvent.setup();

		render(<Tag>{name}</Tag>);
		const tagElement = screen.getByRole("checkbox", { name });

		expect(tagElement).not.toHaveClass("selected");
		expect(tagElement).toHaveAttribute("aria-checked", "false");

		await user.click(tagElement);
		expect(tagElement).toHaveClass("selected");
		expect(tagElement).toHaveAttribute("aria-checked", "true");

		await user.click(tagElement);
		expect(tagElement).not.toHaveClass("selected");
		expect(tagElement).toHaveAttribute("aria-checked", "false");
	});

	it("toggles selected state on Space key press", async () => {
		const user = userEvent.setup();
		const name = "Tag Name";
		render(<Tag>{name}</Tag>);
		const tagElement = screen.getByRole("checkbox", { name });

		await user.tab();
		expect(tagElement).toHaveFocus();

		fireEvent.keyDown(tagElement, { key: " ", code: "Space" });
		expect(tagElement).toHaveClass("selected");

		fireEvent.keyDown(tagElement, { key: " ", code: "Space" });
		expect(tagElement).not.toHaveClass("selected");
	});

	it.skip("toggles selected state on Space key press (userEvent)", async () => {
		const user = userEvent.setup();
		const name = "Tag Name";
		render(<Tag>{name}</Tag>);
		const tagElement = screen.getByRole("checkbox", { name });

		await user.tab();
		expect(tagElement).toHaveFocus();

		await user.keyboard(" ");
		await waitFor(() => expect(tagElement).toHaveClass("selected"));

		await user.keyboard(" ");
		await waitFor(() => expect(tagElement).not.toHaveClass("selected"));
	});

	it("calls onClick prop when clickable is true", async () => {
		const user = userEvent.setup();
		const onClickMock = vi.fn();
		const tagText = "Clickable Tag";
		render(
			<Tag clickable onClick={onClickMock}>
				{tagText}
			</Tag>
		);
		const tagElement = screen.getByRole("checkbox", { name: tagText });

		await user.click(tagElement);
		expect(onClickMock).toHaveBeenCalledWith(true);

		await user.click(tagElement);
		expect(onClickMock).toHaveBeenCalledWith(false);
	});

	it("does not call onClick prop when clickable is false", async () => {
		const user = userEvent.setup();
		const onClickMock = vi.fn();
		const tagText = "Non-clickable Tag";
		render(<Tag onClick={onClickMock}>{tagText}</Tag>);
		const tagElement = screen.getByRole("checkbox", { name: tagText });

		await user.click(tagElement);
		expect(onClickMock).not.toHaveBeenCalled();
	});
});
