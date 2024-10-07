import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";

import { resourceStub, server } from "../../../setupTests";

import Home from "./index";

const mockTopics = [
	{ id: "topic1", name: "React" },
	{ id: "topic2", name: "JavaScript" },
	{ id: "topic3", name: "Node.js" },
];

describe("Home", () => {
	beforeEach(() => {
		server.use(
			http.get("/api/topics", () => {
				return HttpResponse.json(mockTopics);
			})
		);
	});

	it("shows resources", async () => {
		const resource = resourceStub({
			description: "This is a very useful resource I found",
			id: "abc123",
			title: "Hello",
			url: "https://example.com",
		});
		server.use(
			http.get("/api/resources", () => {
				return HttpResponse.json({
					lastPage: 1,
					page: 1,
					perPage: 20,
					resources: [resource],
					totalCount: 1,
				});
			})
		);

		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>
		);

		await expect(
			screen.findByRole("heading", { level: 3 })
		).resolves.toHaveTextContent(resource.title);
		expect(screen.getByRole("link", { name: "example.com" })).toHaveAttribute(
			"href",
			resource.url
		);
		expect(
			screen.getByText(new RegExp(resource.description))
		).toBeInTheDocument();
	});

	it("displays filter tags", async () => {
		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>
		);

		for (const topic of mockTopics) {
			await waitFor(() => {
				expect(screen.getByText(topic.name)).toBeInTheDocument();
			});
		}
	});

	it("filters resources when a tag is selected", async () => {
		const user = userEvent.setup();
		const filteredResource = resourceStub({
			title: "React Resource",
			topic: "topic1",
		});

		server.use(
			http.get("/api/resources", ({ request }) => {
				const url = new URL(request.url);
				const topics = url.searchParams.get("topics");
				if (topics === "topic1") {
					return HttpResponse.json({
						resources: [filteredResource],
						totalCount: 1,
						lastPage: 1,
						page: 1,
						perPage: 20,
					});
				}
				return HttpResponse.json({
					resources: [],
					totalCount: 0,
					lastPage: 1,
					page: 1,
					perPage: 20,
				});
			})
		);

		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByText("React")).toBeInTheDocument();
		});

		await user.click(screen.getByText("React"));

		await waitFor(() => {
			expect(screen.getByText("React Resource")).toBeInTheDocument();
		});
	});

	it("updates resource list when multiple tags are selected", async () => {
		const user = userEvent.setup();
		const reactResource = resourceStub({
			title: "React Resource",
			topic: "topic1",
		});
		const jsResource = resourceStub({
			title: "JavaScript Resource",
			topic: "topic2",
		});

		server.use(
			http.get("/api/resources", ({ request }) => {
				const url = new URL(request.url);
				const topics = url.searchParams.get("topics")?.split(",");
				const filteredResources = [reactResource, jsResource].filter((r) =>
					topics?.includes(r.topic)
				);
				return HttpResponse.json({
					resources: filteredResources,
					totalCount: filteredResources.length,
					lastPage: 1,
					page: 1,
					perPage: 20,
				});
			})
		);

		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByText("React")).toBeInTheDocument();
		});

		await user.click(screen.getByText("React"));
		await user.click(screen.getByText("JavaScript"));

		await waitFor(() => {
			expect(screen.getByText("React Resource")).toBeInTheDocument();
		});
		expect(screen.getByText("JavaScript Resource")).toBeInTheDocument();
	});

	it("removes filter when tag is deselected", async () => {
		const user = userEvent.setup();
		const reactResource = resourceStub({
			title: "React Resource",
			topic: "topic1",
		});

		server.use(
			http.get("/api/resources", ({ request }) => {
				const url = new URL(request.url);
				const topics = url.searchParams.get("topics")?.split(",");
				const filteredResources = topics?.includes("topic1")
					? [reactResource]
					: [];
				return HttpResponse.json({
					resources: filteredResources,
					totalCount: filteredResources.length,
					lastPage: 1,
					page: 1,
					perPage: 20,
				});
			})
		);

		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByText("React")).toBeInTheDocument();
		});

		await user.click(screen.getByText("React"));

		await waitFor(() => {
			expect(screen.getByText("React Resource")).toBeInTheDocument();
		});

		await user.click(screen.getByText("React"));

		await waitFor(() => {
			expect(screen.queryByText("React Resource")).not.toBeInTheDocument();
		});
	});
});
