import fs from 'fs/promises';
import matter from 'gray-matter';
import Link from 'next/link';
import path from 'path';

export async function getStaticProps() {
	console.log(`Path: ${path.join(process.cwd(), 'markdown')}`);
	const files = await fs.readdir(path.join(process.cwd(), 'markdown'));

	const posts: any[] = [];

	for (let fileName of files) {
		const slug = fileName.replace('.md', '');
		const readFile = await fs.readFile(
			path.join(process.cwd(), 'markdown', fileName),
			'utf-8'
		);
		const { data: frontmatter } = matter(readFile);

		posts.push({
			slug,
			frontmatter,
		});
	}

	return {
		props: {
			posts,
		},
	};
}

export default function Blog({ posts }: { [prop: string]: any }) {
	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold">Blog</h1>
			<div className="flex flex-col items-center justify-center">
				{posts.map((post: any) => (
					<div
						key={post.slug}
						className="flex flex-col items-center justify-center"
					>
						<h2 className="text-2xl font-bold">
							{post.frontmatter.title}
						</h2>
						<p>{post.frontmatter.description}</p>
						<Link href={`/blog/${post.slug}`}>
							<a className="text-blue-500">Read more</a>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
