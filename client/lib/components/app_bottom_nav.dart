import 'package:flutter/material.dart';

class AppBottomNav extends StatelessWidget {
  const AppBottomNav({
    super.key,
    required this.selectedIndex,
    required this.onDestinationSelected,
    required this.homeLabel,
    required this.recipesLabel,
    required this.therapyLabel,
    required this.profileLabel,
  });

  final int selectedIndex;
  final ValueChanged<int> onDestinationSelected;
  final String homeLabel;
  final String recipesLabel;
  final String therapyLabel;
  final String profileLabel;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Container(
        height: 82,
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Color(0xFFF0F0F0))),
        ),
        padding: const EdgeInsets.fromLTRB(12, 8, 12, 10),
        child: Row(
          children: [
            Expanded(
              child: _NavItem(
                label: homeLabel,
                icon: Icons.cottage_outlined,
                selectedIcon: Icons.cottage,
                selected: selectedIndex == 0,
                selectedColor: const Color(0xFFA1C298),
                onTap: () => onDestinationSelected(0),
              ),
            ),
            Expanded(
              child: _NavItem(
                label: recipesLabel,
                icon: Icons.emoji_food_beverage_outlined,
                selectedIcon: Icons.emoji_food_beverage,
                selected: selectedIndex == 1,
                selectedColor: const Color(0xFFD4B996),
                onTap: () => onDestinationSelected(1),
              ),
            ),
            Expanded(
              child: _NavItem(
                label: therapyLabel,
                icon: Icons.self_improvement_outlined,
                selectedIcon: Icons.self_improvement,
                selected: selectedIndex == 2,
                selectedColor: const Color(0xFF5AC8FA),
                onTap: () => onDestinationSelected(2),
              ),
            ),
            Expanded(
              child: _NavItem(
                label: profileLabel,
                icon: Icons.account_circle_outlined,
                selectedIcon: Icons.account_circle,
                selected: selectedIndex == 3,
                selectedColor: const Color(0xFF4CD964),
                onTap: () => onDestinationSelected(3),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.label,
    required this.icon,
    required this.selectedIcon,
    required this.selected,
    required this.selectedColor,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final IconData selectedIcon;
  final bool selected;
  final Color selectedColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final Color color = selected ? selectedColor : const Color(0xFFBFC4CC);

    return InkWell(
      borderRadius: BorderRadius.circular(18),
      onTap: onTap,
      child: Center(
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          curve: Curves.easeOut,
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: selected ? selectedColor.withOpacity(0.10) : Colors.transparent,
            borderRadius: BorderRadius.circular(18),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(selected ? selectedIcon : icon, size: 22, color: color),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10,
                  height: 1,
                  color: color,
                  fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
