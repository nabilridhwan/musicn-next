import fs from 'fs/promises';
import matter from 'gray-matter';
import md from 'markdown-it';
import Container from '../../components/Container';

export async function getStaticPaths() {
	const files = await fs.readdir('markdown');
	const paths = files.map((fileName) => ({
		params: {
			slug: fileName.replace('.md', ''),
		},
	}));

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({
	params: { slug },
}: {
	[prop: string]: any;
}) {
	const fileName = await fs.readFile(`markdown/${slug}.md`, 'utf-8');
	const { data: frontmatter, content } = matter(fileName);
	return {
		props: {
			frontmatter,
			content,
		},
	};
}

export default function Post({
	frontmatter,
	content,
}: {
	[prop: string]: any;
}) {
	console.log(frontmatter, content);
	return (
		<Container>
			<div className="prose prose-invert mx-auto">
				<h1 className="">{frontmatter.title}</h1>
				<p className="lead">{frontmatter.desc}</p>
				<p className="text-sm">Written by {frontmatter.author}</p>
				<div
					className="mt-20"
					dangerouslySetInnerHTML={{ __html: md().render(content) }}
				/>
			</div>
		</Container>
	);
}
