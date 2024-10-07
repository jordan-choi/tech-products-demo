import { useEffect, useState } from "react";

import { Pagination, ResourceList } from "../../components";
import FilterTagList from "../../components/FilterTagList";
import { useSearchParams } from "../../hooks";
import { ResourceService, TopicService, useService } from "../../services";

export function Home() {
	const resourceService = useService(ResourceService);
	const topicService = useService(TopicService);

	const searchParams = useSearchParams();
	const [{ lastPage, resources } = {}, setEnvelope] = useState();
	const [topics, setTopics] = useState([]);
	const [selectedTopics, setSelectedTopics] = useState([]);

	useEffect(() => {
		resourceService
			.getPublished({ ...searchParams, topics: selectedTopics })
			.then(setEnvelope);
	}, [resourceService, searchParams, selectedTopics]);

	useEffect(() => {
		topicService.getTopics().then(setTopics);
	}, [topicService]);

	return (
		<section>
			<FilterTagList topics={topics ?? []} onChange={setSelectedTopics} />
			<ResourceList resources={resources ?? []} />
			<Pagination lastPage={lastPage ?? 1} />
		</section>
	);
}

export default Home;
