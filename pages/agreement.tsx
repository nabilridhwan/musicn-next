import Container from '@/components/Container';
import fs from 'fs/promises';
import matter from 'gray-matter';
import md from 'markdown-it';
import Head from 'next/head';

export async function getStaticProps() {
  const fileName = await fs.readFile(`markdown/agreement.md`, 'utf-8');
  const {data: frontmatter, content} = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}

export default function Post({frontmatter, content}: {[prop: string]: any}) {
  return (
    <>
      <Head>
        <title>Agreement</title>
      </Head>
      <Container>
        <div className="prose prose-invert mx-auto">
          <h1>Agreement</h1>
          <div
            className="mt-20"
            dangerouslySetInnerHTML={{
              __html: md().render(content),
            }}
          />
        </div>
      </Container>
    </>
  );
}
