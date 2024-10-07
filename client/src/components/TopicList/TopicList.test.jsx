import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TopicList from ".";

describe("TopicList", () => {
	const mockTopics = [
		{ id: "1", name: "React" },
		{ id: "2", name: "JavaScript" },
		{ id: "3", name: "TypeScript" },
	];

	it("displays all topics", () => {
		render(<TopicList topics={mockTopics} />);
		mockTopics.forEach((topic) => {
			expect(screen.getByText(topic.name)).toBeInTheDocument();
		});
	});

	it('displays "No topic to show" when topics array is empty', () => {
		render(<TopicList topics={[]} />);
		expect(screen.getByText("No topic to show.")).toBeInTheDocument();
	});

	it("calls onChange with selected topics when a topic is clicked", async () => {
		const user = userEvent.setup();
		const mockOnChange = vi.fn();
		render(<TopicList topics={mockTopics} onChange={mockOnChange} />);

		await user.click(screen.getByText(mockTopics[0].name));
		expect(mockOnChange).toHaveBeenCalledWith([mockTopics[0].id]);

		await user.click(screen.getByText(mockTopics[1].name));
		expect(mockOnChange).toHaveBeenCalledWith([
			mockTopics[0].id,
			mockTopics[1].id,
		]);
	});

	it("removes a topic from selection when clicked again", async () => {
		const user = userEvent.setup();
		const mockOnChange = vi.fn();
		render(<TopicList topics={mockTopics} onChange={mockOnChange} />);

		await user.click(screen.getByText(mockTopics[0].name));
		await user.click(screen.getByText(mockTopics[1].name));
		await user.click(screen.getByText(mockTopics[0].name));

		expect(mockOnChange).toHaveBeenLastCalledWith([mockTopics[1].id]);
	});
});
