Wumpus World PEAS 描述：
性能度量：
gold +1000, death -1000-
1 per step, -10 for using the arrow
环境描述：
Squares adjacent to wumpusare smelly
Squares adjacent to pit are breezy
Glitter iffgold is in the same square
Shooting kills wumpus if you are facing it
Shooting uses up the only arrow
Grabbing picks up gold if in same square
Releasing drops the gold in same square
传感器：Stench, Breeze, Glitter, Bump, Scream
执行器：Left turn, Right turn, Forward, Grab, Release, Shoot

Wumpus世界的PEAS描述
- 性能度量：金子+100，死亡-1000，每一步-1，用箭-10
- 环境：4×4网格，智能体初始在[1,1]，面向右方，金子和wumpus在[1,1]之外随机均匀分布
- 执行器：左转，右转，前进，捡起，射箭
    - 智能体可向前、左转或右转
    - 智能体如果进入一个有陷阱或者活着的wumpus的方格，将死去。
    - 如果智能体前方有一堵墙，那么向前移动无效
    - Grab：捡起智能体所在方格中的一个物体
    - Shoot：向智能体所正对方向射箭(只有一枝箭)
- 传感器：
    - Smell：在wumpus所在之外以及与之直接相邻的方格内，智能体可以感知到臭气。
    - Breeze：在与陷阱直接相邻的方格内，智能体可以感知到微风。
    - Glitter(发光)：在金子所处的方格内，智能体可以感知到闪闪金光。
    - 当智能体撞到墙时，它感受到撞击。
    - 当wumpus被杀死时，它发出洞穴内任何地方都可感知到的悲惨嚎叫。
