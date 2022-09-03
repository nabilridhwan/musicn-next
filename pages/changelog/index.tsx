import Container from '@/components/Container';
import fs from 'fs/promises';
import matter from 'gray-matter';
import Link from 'next/link';
import path from 'path';

export async function getStaticProps() {
	console.log(`Path: ${path.join(process.cwd(), 'changelog-md')}`);
	const files = await fs.readdir(path.join(process.cwd(), 'changelog-md'));

	const posts: any[] = [];

	for (let fileName of files) {
		const slug = fileName.replace('.md', '');
		const readFile = await fs.readFile(
			path.join(process.cwd(), 'changelog-md', fileName),
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
			posts: posts.reverse(),
		},
	};
}

export default function Changelog({ posts }: { [prop: string]: any }) {
	return (
		<Container>
			<h1 className="text-3xl font-bold">Changelog</h1>
			<div className="">
				{posts.map((post: any) => (
					<div
						key={post.slug}
						className="border border-white/30 p-5 my-5 rounded-lg"
					>
						<h2 className="text-2xl font-bold">
							{post.frontmatter.title}
						</h2>
						<p className="muted">{post.frontmatter.desc}</p>

						<Link href={`/changelog/${post.slug}`}>
							<a className="btn-base bg-white text-black">
								Read more
							</a>
						</Link>
					</div>
				))}
			</div>
		</Container>
	);
}
