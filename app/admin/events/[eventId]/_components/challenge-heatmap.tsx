import type { Challenge, Media } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChallengeHeatmapProps {
  challenges: Challenge[];
  media: Media[];
}

export function ChallengeHeatmap({ challenges, media }: ChallengeHeatmapProps) {
  const maxCount = Math.max(
    ...challenges.map(
      (c) => media.filter((m) => m.challenge_tag === c.title).length
    ),
    1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Challenge completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.length === 0 ? (
          <p className="text-sm text-muted-foreground">No challenges configured.</p>
        ) : (
          challenges.map((challenge) => {
            const count = media.filter(
              (m) => m.challenge_tag === challenge.title
            ).length;
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={challenge.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {challenge.icon} {challenge.title}
                  </span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <Progress value={pct} />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
