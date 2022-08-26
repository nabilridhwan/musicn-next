import fs from 'fs/promises';
import matter from 'gray-matter';
import md from 'markdown-it';
import Head from 'next/head';
import Container from '../components/Container';

export async function getStaticProps() {
	const fileName = await fs.readFile(`markdown/changelog.md`, 'utf-8');
	const { data: frontmatter, content } = matter(fileName);
	return {
		props: {
			frontmatter,
			content,
		},
	};
}

export default function Post({ frontmatter, content }: { [prop: string]: any }) {
	return (
		<>
			<Head>
				<title>Changelog</title>
			</Head>
			<Container>
				<div className="prose prose-invert mx-auto">
					<h1>Changelog</h1>
					<p className="text-sm">Last updated {new Date(frontmatter.last_updated).toUTCString()}</p>

					<div className="mt-20" dangerouslySetInnerHTML={{ __html: md().render(content) }} />
				</div>
			</Container>
		</>
	);
}
