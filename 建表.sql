CREATE TABLE `users` (
`id` int auto_increment,
`username`  varchar(255) NOT NULL ,
`password`  varchar(255) NOT NULL ,
PRIMARY KEY (`id`)
);

CREATE TABLE `userinfo` (
`id` int auto_increment,
`username` varchar(255) NOT NULL,
`nickname` varchar(255) NOT NULL,
`signature`  varchar(255) DEFAULT('这个人很懒，什么都没有写...'),
`articlenumbers`  int DEFAULT(0) ,
`avatarurl` varchar(255) DEFAULT('http://cmk1018.cn/wp-content/uploads/2019/04/8.jpg'),
 PRIMARY KEY (`id`)
);

CREATE TABLE `articles` (
`id` int auto_increment,
`title` varchar(255) NOT NULL,
`content` longtext NOT NULL,
`createtime`  bigint,
`author`  varchar(255) NOT NULL ,
`coverurl` varchar(255),
`abstract` varchar(255),
 PRIMARY KEY (`id`)
);
