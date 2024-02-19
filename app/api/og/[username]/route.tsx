import {ImageResponse} from 'next/og';
import {NextRequest} from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  {params}: {params: {username: string}},
) {
  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center">
        <div tw="bg-gray-800 flex w-[500px]">
          <div tw="flex flex-col w-full py-12 px-4 p-8">
            <div tw="flex items-center">
              <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-100 text-left">
                @{params.username}
              </h2>
            </div>

            <p tw="text-gray-400">
              Musicn – Get a glimpse into the musical tastes of your friends and
              discover new tracks with Musicn!
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    },
  );
}
